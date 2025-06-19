package summarizer

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"summarizer-service/internal/model"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

var (
	data = model.PersonalData{
		WorkExperience: []*model.WorkExperience{
			{
				ID:          1,
				Company:     "Google",
				Location:    "Mountain View",
				StartDate:   "2021-01-01",
				EndDate:     "2023-01-01",
				Position:    "Software Engineer",
				Description: "Worked on scalable backend systems.",
				TechStack:   "Go, Kubernetes, GCP",
			},
		},
		Education: []*model.Education{
			{
				ID:          1,
				Institution: "MIT",
				Location:    "Cambridge, MA",
				StartDate:   time.Date(2016, time.September, 1, 0, 0, 0, 0, time.UTC),
				EndDate:     ptrTime(time.Date(2020, time.May, 31, 0, 0, 0, 0, time.UTC)),
				Degree:      "B.Sc. in Computer Science",
				Thesis:      "Efficient Parallel Algorithms",
			},
		},
		Projects: []*model.Project{
			{
				ID:        1,
				Name:      "SmartAI",
				URL:       "https://github.com/user/smartai",
				TechStack: "Go, TensorFlow",
			},
		},
		Skills: []*model.Skill{
			{
				ID:         1,
				Category:   "Programming Languages",
				SkillNames: "Go, Python, JavaScript",
			},
		},
		Certificates: []*model.Certificate{
			{
				ID:   1,
				Name: "AWS Certified Solutions Architect",
				URL:  "https://aws.amazon.com/certification/",
			},
		},
	}
)

func ptrTime(t time.Time) *time.Time {
	return &t
}

type mockRedis struct {
	store map[string]string
}

func newMockRedis() *mockRedis {
	return &mockRedis{store: make(map[string]string)}
}

func (m *mockRedis) Set(key string, value any) error {
	bytes, err := json.Marshal(value)
	if err != nil {
		return err
	}
	m.store[key] = string(bytes)
	return nil
}

func (m *mockRedis) Get(key string, dest any) error {
	val, ok := m.store[key]
	if !ok {
		return fmt.Errorf("key not found")
	}
	return json.Unmarshal([]byte(val), dest)
}

func (m *mockRedis) Del(key string) error {
	delete(m.store, key)
	return nil
}

func modifiedData() model.PersonalData {
	d := data
	d.WorkExperience[0].Company = "Microsoft"
	return d
}

func mockDataServer(t *testing.T, data model.PersonalData) *httptest.Server {
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var resp interface{}
		switch r.URL.Path {
		case "/work-experience":
			resp = data.WorkExperience
		case "/education":
			resp = data.Education
		case "/project":
			resp = data.Projects
		case "/skill":
			resp = data.Skills
		case "/certificate":
			resp = data.Certificates
		default:
			http.Error(w, "not found", http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(resp)
	}))
}

func mockLLMServer(t *testing.T, response string, fail bool) *httptest.Server {
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if fail {
			http.Error(w, "model error", http.StatusInternalServerError)
			return
		}
		resp := model.SummarizerAPIResponse{
			Choices: []model.Choice{
				{
					Message: model.Message{
						Content: response,
					},
				},
			},
		}
		json.NewEncoder(w).Encode(resp)
	}))
}

func TestSummarizer_Summarize(t *testing.T) {
	tests := []struct {
		name             string
		data             model.PersonalData
		llmContent       string
		llmFail          bool
		expectErr        bool
		primeCache       bool
		changeData       bool
		expectFromCache  bool
		expectedContains string
	}{
		{
			name:             "successful summary and cache it",
			data:             data,
			llmContent:       "Nurzhanat Zhussup is a software engineer with experience at Google...",
			expectedContains: "Nurzhanat",
		},
		{
			name:             "summary returned from cache",
			data:             data,
			primeCache:       true,
			expectFromCache:  true,
			expectedContains: "Cached summary for Nurzhanat",
		},
		{
			name:      "LLM failure",
			data:      data,
			llmFail:   true,
			expectErr: true,
		},
		{
			name:       "missing LLM response",
			data:       data,
			llmContent: "",
			expectErr:  true,
		},
		{
			name:             "data changed triggers fresh summarization",
			data:             modifiedData(), // function below
			llmContent:       "New summary after data changed for Nurzhanat",
			changeData:       true,
			expectedContains: "New summary",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			redis := newMockRedis()

			// Prime cache if needed
			if tt.primeCache {
				_ = redis.Set("previous_personal_data", &tt.data)
				_ = redis.Set("summary", "Cached summary for Nurzhanat")
			}

			dataSrv := mockDataServer(t, tt.data)
			defer dataSrv.Close()

			llmSrv := mockLLMServer(t, tt.llmContent, tt.llmFail)
			defer llmSrv.Close()

			s := NewSummarizer("dummy-key", llmSrv.URL, []string{
				dataSrv.URL + "/work-experience",
				dataSrv.URL + "/education",
				dataSrv.URL + "/project",
				dataSrv.URL + "/skill",
				dataSrv.URL + "/certificate",
			}, llmSrv.Client(), redis)

			summary, err := s.Summarize(context.Background())

			if tt.expectErr {
				require.Error(t, err)
			} else {
				require.NoError(t, err)
				require.Contains(t, summary, tt.expectedContains)
			}
		})
	}
}

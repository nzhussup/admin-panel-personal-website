package main

import (
	"net/http"
	"summarizer-service/internal/summarizer"

	"github.com/gin-gonic/gin"
)

// handleGetSummarizer godoc
// @Summary      Get summarized profile
// @Description  Fetches personal data, generates a summary using LLM, and returns the professional bio summary.
// @Tags         summarizer
// @Produce      json
// @Success      200  {string}  string  "Professional summary string"
// @Failure      500  {object}  map[string]string  "Internal server error"
// @Router       /summarizer [get]
func (app *app) handleGetSummarizer(ctx *gin.Context) {

	s := summarizer.NewSummarizer(
		app.config.summarizerConfig.API_KEY,
		app.config.summarizerConfig.API_URL,
		[]string{
			app.config.servicesConfig.WORK_EXPERIENCE_URL,
			app.config.servicesConfig.EDUCATION_URL,
			app.config.servicesConfig.PROJECTS_URL,
			app.config.servicesConfig.SKILLS_URL,
			app.config.servicesConfig.CERTIFICATES_URL,
		},
		http.DefaultClient,
		app.redis,
	)

	summary, err := s.Summarize(ctx.Request.Context())
	if err != nil {
		constructErrorResponse(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	if summary == "" {
		constructErrorResponse(ctx, http.StatusInternalServerError, summarizer.ErrNoSummaryReceived.Error())
		return
	}

	constructJSONResponse(ctx, http.StatusOK, summary)
}

package security

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type ValidationRequest struct {
	Token string `json:"token"`
}

type ValidationResponse struct {
	Username string   `json:"username"`
	Roles    []string `json:"roles"`
}

// AuthMiddleware is a middleware function that checks the authorization token
// in the request header and validates it with the auth service.
// If the token is valid, it sets the username and roles in the context.
// If the token is invalid or missing, it returns a 401 Unauthorized response.
// It allows GET requests to pass through without validation.
func AuthMiddleware(authServiceURL string, err error) gin.HandlerFunc {
	return func(c *gin.Context) {

		if c.Request.Method == http.MethodGet {
			c.Next()
			return
		}

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not find auth service"})
			c.Abort()
			return
		}
		if authServiceURL == "" {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Auth service URL is not set"})
			c.Abort()
			return
		}

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")

		reqBody, _ := json.Marshal(ValidationRequest{Token: token})

		var resp *http.Response
		resp, err = http.Post(authServiceURL+"/auth/validate", "application/json", bytes.NewBuffer(reqBody))
		if err != nil || resp.StatusCode == http.StatusInternalServerError {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Auth service unavailable"})
			c.Abort()
			return
		}
		if resp.StatusCode != http.StatusOK {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		body, _ := io.ReadAll(resp.Body)
		var validationResponse ValidationResponse
		json.Unmarshal(body, &validationResponse)

		c.Set("username", validationResponse.Username)
		c.Set("roles", validationResponse.Roles)

		c.Next()
	}
}

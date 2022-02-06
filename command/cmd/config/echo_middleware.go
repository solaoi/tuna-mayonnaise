package config

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/time/rate"
)

func GetRateLimiterConfig(unit string, limit float64, burst float64, expireSecond float64) middleware.RateLimiterConfig {

	return middleware.RateLimiterConfig{
		Skipper: middleware.DefaultSkipper,
		Store: middleware.NewRateLimiterMemoryStoreWithConfig(
			middleware.RateLimiterMemoryStoreConfig{Rate: rate.Limit(limit), Burst: int(burst), ExpiresIn: time.Duration(expireSecond) * time.Second},
		),
		IdentifierExtractor: func(ctx echo.Context) (string, error) {
			id := "limitAllRequestsEqually"
			if unit == "ip" {
				id = ctx.RealIP()
			}

			return id, nil
		},
		ErrorHandler: func(context echo.Context, err error) error {
			return context.JSON(http.StatusForbidden, map[string]string{"message": "Forbidden"})
		},
		DenyHandler: func(context echo.Context, identifier string, err error) error {
			return context.JSON(http.StatusTooManyRequests, map[string]string{"message": "Too Many Requests"})
		},
	}
}

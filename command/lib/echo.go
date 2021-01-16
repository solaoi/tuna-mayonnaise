package lib

import (
	"os"
	"net/http"
	"strings"

	assetfs "github.com/elazarl/go-bindata-assetfs"
	"github.com/labstack/echo"
)

const version = "0.0.1"

// ServeFileSystem
type ServeFileSystem interface {
	http.FileSystem
	Exists(prefix string, path string) bool
}

type binaryFileSystem struct {
	fs http.FileSystem
}

func (b *binaryFileSystem) Open(name string) (http.File, error) {
	f, err := b.fs.Open(name)
    if os.IsNotExist(err) {
        // Not found, try with .html
        if f, err := b.fs.Open(name + ".html"); err == nil {
            return f, nil
		}
		// Not found, try with .json
		if f, err := b.fs.Open(name + ".json"); err == nil {
            return f, nil
        }
    }
    return f, err
}

func (b *binaryFileSystem) Exists(prefix string, filepath string) bool {
	if p := strings.TrimPrefix(filepath, prefix); len(p) < len(filepath) {
		if _, err := b.Open(p); err != nil {
			return false
		}
		return true
	}
	return false
}

func BinaryFileSystem(fs *assetfs.AssetFS) *binaryFileSystem {
	return &binaryFileSystem{fs}
}

func ServeRoot(urlPrefix string, fs *assetfs.AssetFS) echo.MiddlewareFunc {
	return Serve(urlPrefix, BinaryFileSystem(fs))
}

func ServeRootSimple(urlPrefix string, fs http.FileSystem) echo.MiddlewareFunc {
	return Serve(urlPrefix, &binaryFileSystem{fs})
}

// Serve Static returns a middleware handler that serves static files in the given directory.
func Serve(urlPrefix string, fs ServeFileSystem) echo.MiddlewareFunc {
	fileserver := http.FileServer(fs)
	if urlPrefix != "" {
		fileserver = http.StripPrefix(urlPrefix, fileserver)
	}
	return func(before echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			err := before(c)
			if err != nil {
				if c, ok := err.(*echo.HTTPError); !ok || c.Code != http.StatusNotFound {
					return err
				}
			}

			w, r := c.Response(), c.Request()
			if fs.Exists(urlPrefix, r.URL.Path) {
				fileserver.ServeHTTP(w, r)
				return nil
			}
			return err
		}
	}
}
package custom_errors

import "errors"

var (
	ErrNotFound       = errors.New("not found")
	ErrInternalServer = errors.New("internal server error")
	ErrBadRequest     = errors.New("bad request")
	ErrConflict       = errors.New("conflict")
)

func NewNotFoundError(message string) error {
	return errors.Join(ErrNotFound, errors.New(message))
}

func NewInternalServerError(message string) error {
	return errors.Join(ErrInternalServer, errors.New(message))
}

func NewBadRequestError(message string) error {
	return errors.Join(ErrBadRequest, errors.New(message))
}

func NewConflictError(message string) error {
	return errors.Join(ErrConflict, errors.New(message))
}

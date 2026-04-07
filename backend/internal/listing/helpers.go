package listing

import (
	"fmt"
	"strconv"
	"time"
)

func parseOptionalString(value string) *string {
	if value == "" {
		return nil
	}
	return &value
}

func parseOptionalInt(value string) (*int, error) {
	if value == "" {
		return nil, nil
	}
	n, err := strconv.Atoi(value)
	if err != nil {
		return nil, err
	}
	return &n, nil
}

func parseOptionalTime(value string) (*time.Time, error) {
	if value == "" {
		return nil, nil
	}
	t, err := time.Parse(time.RFC3339, value)
	if err != nil {
		return nil, err
	}
	return &t, nil
}

func parseRequiredInt(value string, field string) (int, error) {
	n, err := strconv.Atoi(value)
	if err != nil {
		return 0, fmt.Errorf("%s must be an integer", field)
	}
	return n, nil
}

func parseRequiredFloat(value string, field string) (float64, error) {
	n, err := strconv.ParseFloat(value, 64)
	if err != nil {
		return 0, fmt.Errorf("%s must be a number", field)
	}
	return n, nil
}

func parseRequiredBool(value string, field string) (bool, error) {
	b, err := strconv.ParseBool(value)
	if err != nil {
		return false, fmt.Errorf("%s must be a boolean", field)
	}
	return b, nil
}

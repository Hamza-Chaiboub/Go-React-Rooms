package main

import (
	"go-react-rooms/internal/app"
	"go-react-rooms/internal/config"
	"log"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	configuration := config.LoadConfig()
	application, err := app.New(configuration)
	if err != nil {
		log.Fatal(err)
	}

	srv := application.Server()

	go func() {
		log.Printf("API listening on %s", srv.Addr)
		if err := srv.ListenAndServe(); err != nil {
			log.Println("err")
		}
	}()

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGINT, syscall.SIGTERM)
	<-shutdown

	_ = srv.Close()
}

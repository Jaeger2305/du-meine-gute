package main

import (
	"fmt"

	"github.com/spf13/viper"
)

func setupConfig() {
	viper.SetConfigName("default")
	viper.SetConfigType("env")
	viper.SetEnvPrefix("dmg")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig() // Find and read the config file
	if err != nil {             // Handle errors reading the config file
		panic(fmt.Errorf("Fatal error config file: %s", err))
	}
	viper.AutomaticEnv()
}

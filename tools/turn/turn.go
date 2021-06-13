package main

import (
	"flag"
	"log"
	"net"
	"os"
	"os/signal"
	"regexp"
	"strconv"
	"syscall"

	"github.com/pion/turn/v2"
)

func main() {
	publicIP := flag.String("public-ip", "", "")
	port := flag.Int("port", 3478, "")
	users := flag.String("users", "", "") // user=pass,user=pass
	realm := flag.String("realm", "v.bora.sh", "")
	flag.Parse()

	if len(*publicIP) == 0 {
		log.Fatalf("public-ip is required")
	}

	if len(*users) == 0 {
		log.Fatalf("'users' is required")
	}

	udpListener, err := net.ListenPacket("udp4", "0.0.0.0:"+strconv.Itoa(*port))
	if err != nil {
		log.Panicf("failed to create TURN server listener: %s", err)
	}

	usersMap := map[string][]byte{}
	for _, kv := range regexp.MustCompile(`(\w+)=(\w+)`).FindAllStringSubmatch(*users, -1) {
		usersMap[kv[1]] = turn.GenerateAuthKey(kv[1], *realm, kv[2])
	}

	s, err := turn.NewServer(turn.ServerConfig{
		Realm: *realm,
		AuthHandler: func(username string, realm string, srcAddr net.Addr) ([]byte, bool) {
			if key, ok := usersMap[username]; ok {
				return key, true
			}
			return nil, false
		},

		PacketConnConfigs: []turn.PacketConnConfig{
			{
				PacketConn: udpListener,
				RelayAddressGenerator: &turn.RelayAddressGeneratorPortRange{
					RelayAddress: net.ParseIP(*publicIP),
					Address:      "0.0.0.0",
					MinPort:      50000,
					MaxPort:      55000,
				},
			},
		},
	})
	if err != nil {
		log.Panic(err)
	}

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	<-sigs

	if err = s.Close(); err != nil {
		log.Panic(err)
	}
}

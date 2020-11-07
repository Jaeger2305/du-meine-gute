package authmiddleware

import (
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/md5"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
)

type contextKey int

// Enums for the context keys
const (
	AuthTokenContextKey contextKey = iota
	ActiveGameContextKey
	UsernameContextKey
)

// Authorised middleware to check the provided JWT, and populate the context with relevant data
// Originally implemented as session middleware, but JWTs work better with websocket auth due to lack of cookie support via NativeScript
func Authorised(jwtSigningKey []byte, encryptionKey []byte) func(http.Handler) http.Handler {
	fn := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			rawToken := getBearerToken(r)
			decodedToken, decodeTokenErr := hex.DecodeString(rawToken)
			if decodeTokenErr != nil {
				log.Printf("Couldn't decode token, %v", decodeTokenErr)
				http.Error(w, http.StatusText(403), 403)
				return
			}
			decryptedToken := decrypt(decodedToken, encryptionKey)
			token, verifyTokenErr := verifyToken(jwtSigningKey, string(decryptedToken))
			if verifyTokenErr != nil {
				log.Println("Couldn't verify token for request")
				http.Error(w, http.StatusText(403), 403)
				return
			}
			if token == nil {
				log.Println("Couldn't find username in token")
				http.Error(w, http.StatusText(403), 403)
				return
			}

			// Add the information into the context
			ctx := r.Context()
			ctx = context.WithValue(ctx, UsernameContextKey, token.Claims.(jwt.MapClaims)["username"])

			// Set the game specific context
			ctx = context.WithValue(ctx, AuthTokenContextKey, rawToken)
			ctx = context.WithValue(ctx, ActiveGameContextKey, token.Claims.(jwt.MapClaims)["activegame"])

			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
	return fn
}

// CreateHash converts a string into hashed bytes
// This is useful for converting a plaintext passphrase into a symmetric encryption key
func CreateHash(key string) []byte {
	hasher := md5.New()
	hasher.Write([]byte(key))
	return hasher.Sum(nil)
}

// Encrypt generically symmetrically encrypts the input
// Can be used for lots of things, but in DMG it's only used for encrypting the JWT
// Following a JWE spec would be better, but it's not a requirement right now.
func Encrypt(data []byte, key []byte) []byte {
	block, newCipherErr := aes.NewCipher(key)
	if newCipherErr != nil {
		panic(newCipherErr.Error())
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		panic(err.Error())
	}
	nonce := make([]byte, gcm.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		panic(err.Error())
	}
	ciphertext := gcm.Seal(nonce, nonce, data, nil)
	return ciphertext
}

// decrypt generically and symetrically
func decrypt(data []byte, key []byte) []byte {
	block, err := aes.NewCipher(key)
	if err != nil {
		panic(err.Error())
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		panic(err.Error())
	}
	nonceSize := gcm.NonceSize()
	nonce, ciphertext := data[:nonceSize], data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		panic(err.Error())
	}
	return plaintext
}

// getBearerToken Retrieves the auth token from the headers of an incoming HTTP request
// This is flexible in that it can also try and get the header from websocket headers
// Hasn't been tested with SSL
func getBearerToken(r *http.Request) string {
	var bearerToken string

	// A normal HTTP(S) header token
	bearerToken = r.Header.Get("Authorization")

	// Or, it's passed as a websocket request
	if bearerToken == "Bearer null" || bearerToken == "" {
		// This has no Bearer prefix - it violates the protocol having a space in it.
		return r.Header.Get("Sec-WebSocket-Protocol")
	}

	return extractToken(bearerToken)
}

// Attempts to get the token from the value of the HTTP Authorization header
func extractToken(bearerToken string) string {
	// Discard the "Bearer" prefix
	strArr := strings.Split(bearerToken, " ")
	if len(strArr) == 2 {
		return strArr[1]
	}
	return ""
}

// Verifies the JWT token with the server's signing key
func verifyToken(jwtSigningKey []byte, tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conforms to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSigningKey, nil
	})
	if err != nil {
		return nil, err
	}
	return token, nil
}

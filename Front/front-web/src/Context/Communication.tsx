class ApiCommunication {
    private setIsLogged;
    private setAccesToken;
    private setMyInfo;
    private setAboutJSON;

    constructor(
        isLoggedSetter: any,
        accesTokenSetter: any,
        myInfoSetter: any,
        AboutJSONSetter: any
    ) {
        this.setIsLogged = isLoggedSetter;
        this.setAccesToken = accesTokenSetter;
        this.setMyInfo = myInfoSetter;
        this.setAboutJSON = AboutJSONSetter;
    }

    async loginUser(user: string, password: string) {
        const body = {
            email: user,
            password: password,
        };
        try {
            const response = await fetch(`http://localhost:8080/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (response.ok) {
                this.setAccesToken(data.access_token);
                this.setIsLogged(true);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(`Error during network request:${error}`);
            return false;
        }
    }

    async getMe(accesToken: string) {
        try {
            const response = await fetch(
                `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/user/me`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accesToken}`,
                    },
                }
            );
            const data = await response.json();
            if (response.ok) {
                this.setAccesToken(accesToken);
                this.setMyInfo(data);
                this.setIsLogged(true);
                localStorage.setItem("user", JSON.stringify(data));
                localStorage.setItem("access_token", accesToken);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    async delUser(access_token: string) {
        try {
            const response = await fetch(
                `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/user/me`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            if (response.ok) {
            }
        } catch (error) {}
    }

    async changeUserInfo(access_token: string, user_info: any, email: string) {
        const updatedUserInfo = { email, ...user_info };
        try {
            const response = await fetch(
                `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/user/me`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(user_info),
                }
            );
            if (response.ok) {
                localStorage.setItem("user", JSON.stringify(updatedUserInfo));
            }
        } catch (error) {
            throw error;
        }
    }

    async getAbout() {
        try {
            const response = await fetch(
                `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/about.json`,
                {
                    method: "GET",
                }
            );
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("about", JSON.stringify(data));
                this.setAboutJSON(data);
            }
        } catch (error) {
            console.error(`Error during network request: ${error}`);
            throw error;
        }
    }

    async getAuth() {
        try {
            const response = await fetch(
                `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/oauth2/authorization`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem(
                    "Services",
                    JSON.stringify(data.Authorizations)
                );
            }
        } catch (error) {
            console.error(`Error during network request: ${error}`);
        }
    }

    async delAuth(service: string) {
        try {
            const response = await fetch(
                `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/oauth2/authorize/${service}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                }
            );
            if (response.ok) {
            }
        } catch (error) {
            console.error(`Error during network request: ${error}`);
        }
    }

    async deleteArea(name: string) {
        try {
            const response = await fetch(
                `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/area/${name}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                }
            );
            if (response.ok) {
            }
        } catch (error) {
            console.error(`Error during network request: ${error}`);
        }
    }

    async stateArea(name: string) {
        try {
            const response = await fetch(
                `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/area/${name}/disable_enable`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                }
            );
            if (response.ok) {
                return true;
            }
        } catch (error) {
            console.error(`Error during network request: ${error}`);
            return false;
        }
    }
}

export default ApiCommunication;

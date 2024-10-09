import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../Context/AllContext";
import "./Authorization.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";

const ServiceIcon = ({ name }: { name: string }) => {
    return (
        <>
            <Link
                to={`http://${process.env.REACT_APP_API_HOST}:${
                    process.env.REACT_APP_API_PORT
                }/oauth2/authorize/${name}?authorization=${localStorage.getItem(
                    "access_token"
                )}`}
            >
                <img
                    src={require(`../../assets/${name}.png`)}
                    alt="googleLogo"
                    className="serviceLogo"
                />
            </Link>
        </>
    );
};

function Authorization() {
    const context = useContext(MainContext);
    const [displayCard, setDisplayCard] = useState<string[]>(
        JSON.parse(localStorage.getItem("Services") || "[]")
    );
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const about = localStorage.getItem("about");
    let aboutObject;

    if (about) {
        aboutObject = JSON.parse(about);
    }

    const handleDelete = async (name: string) => {
        await context?.API.delAuth(name);
        updateDisplayCard();
    };

    const [services, setServices] = useState(
        aboutObject.server.services.map((services: any) => services.name)
    );

    const updateDisplayCard = async () => {
        await context?.API.getAuth();
        const tmp = localStorage.getItem("Services");
        if (tmp) {
            const parsedServices = JSON.parse(tmp);
            setDisplayCard(parsedServices);
        } else {
            setDisplayCard([]);
        }
    };

    const DisplayAuthorization = ({ name }: { name: string }) => {
        return (
            <div className="Authorization_card">
                <img
                    src={require(`../../assets/${name}.png`)}
                    alt={name}
                    className="card_image"
                />
                <div className="card_button">
                    {/* <input className="switch" type={"checkbox"} /> */}
                    <button
                        className="Auth_button"
                        onClick={() => handleDelete(name)}
                    >
                        <RiDeleteBinLine />
                    </button>
                </div>
            </div>
        );
    };

    useEffect(() => {
        updateDisplayCard();
    }, []);
    return (
        <div className="component_container">
            <div className="component_header">
                <h1 className="component_header_title">Authorization</h1>
                <div className="component_footer_bar" />
            </div>
            <div className="Authorization_container">
                <div className="services_search_bar">
                    {services.map((item: string, index: number) => {
                        if (!displayCard?.includes(item)) {
                            return (
                                <ServiceIcon
                                    key={index.toString()}
                                    name={item}
                                />
                            );
                        }
                        return null;
                    })}
                </div>
                <div className="Authorization_card_container">
                    {displayCard !== undefined
                        ? displayCard.map((item, index) => {
                              return (
                                  <DisplayAuthorization
                                      key={index}
                                      name={item}
                                  />
                              );
                          })
                        : null}
                </div>
            </div>
        </div>
    );
}

export default Authorization;

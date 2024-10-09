import React, { useContext, useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import "../component.css";
import styles from "./Areas.module.css";
import axios from "axios";
import { BiChevronsRight } from "react-icons/bi";
import { GiNightSleep } from "react-icons/gi";
import { GrPowerReset } from "react-icons/gr";
import { MdOutlineDone } from "react-icons/md";
import { useCookies } from "react-cookie";
import { StatusCodes } from "http-status-codes";
import Service from "../../Interfaces/Service";
import ServicesLogo from "./ServicesLogo";
import { MainContext } from "../../Context/AllContext";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        width: "min(95%, 400px)",
        height: "600px",
        transform: "translate(-50%, -50%)",
        borderRadius: "15px",
        backgroundColor: "var(--white-bg-color)",
        boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.4)",
        display: "flex",
        animation: `${styles["zoomIn"]} 0.5s ease-out`,
    },
    overlay: {
        animation: `${styles["fadeIn"]} 0.5s`,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(10px)",
    },
};

const customStylesShow = {
    ...customStyles,
    content: {
        ...customStyles.content,
        border: "solid",
        borderColor: "black",
        borderWidth: 2,
        backgroundColor: "var(--grey-bg-color)",
        width: "min(95%, 600px)",
        height: "800px",
    },
};

const defaultArea: AreaForm = {
    title: "",
    description: "",
    actionService: -1,
    actionId: -1,
    reactionService: -1,
    reactionId: -1,
    isActive: true,
    isDone: false,
    actionData: {},
    reactionData: {},
};

interface AreaForm {
    title: string;
    description: string;
    actionService: number;
    actionId: number;
    reactionService: number;
    reactionId: number;
    isActive: boolean;
    isDone: boolean;
    actionData?: {
        [key: string]: string;
    };
    reactionData?: {
        [key: string]: string;
    };
}

enum ModalMod {
    ADD,
    SHOW,
}

const Areas = () => {
    const context = useContext(MainContext);
    const [cookies] = useCookies();
    const [modalMod, setModalMod] = useState(ModalMod.ADD);
    const [modal, setModal] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [formPage, setFormPage] = useState(1);
    const formLastPage = 3;
    const [area, setArea] = useState<AreaForm>(defaultArea);
    const [tmpState, setTmpState] = useState<boolean>(false);
    const [areas, setAreas] = useState<
        {
            name: string;
            description: string;
            Action: {
                service: string;
                id: number;
                data?: {};
            };
            Reaction: {
                service: string;
                id: number;
                data?: {};
            };
            isActive: boolean;
            isDone: boolean;
        }[]
    >([]);
    const [allServices, setAllServices] = useState<string[]>([]);
    const [services, setServices] = useState<[Service] | []>([]);
    const maxDescLength = 160;
    const [isFetchAreas, setIsFetchAreas] = useState(false);
    const [onlyLinked, setOnlyLinked] = useState<boolean>(false);

    const closeModal = () => {
        setArea(defaultArea);
        setModal(false);
        setFormPage(1);
    };

    const checkForm = () => {
        if (!area?.title?.length) {
            return false;
        }
        if (!area?.description?.length) {
            return false;
        }
        if (area?.actionService === -1) {
            return false;
        }
        if (area?.actionId === -1) {
            return false;
        }
        if (area?.reactionService === -1) {
            return false;
        }
        if (area?.reactionId === -1) {
            return false;
        }
        return true;
    };

    const closeModalShow = async () => {
        if (tmpState !== area.isActive) {
            await context?.API.stateArea(area.title);
            setIsFetchAreas((isFetchAreas) => !isFetchAreas);
        }
        setModalShow(false);
        setArea(defaultArea);
    };

    const fetchAreas = async () => {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/area`,
                {
                    headers: {
                        Authorization: `Bearer ${cookies?.user?.access_token}`,
                    },
                }
            );
            if (response.status === StatusCodes.OK) {
                const areasData = response.data; // Assurez-vous que response.data est au bon format
                setAreas(areasData); // Mettez à jour l'état areas avec les données reçues
            } else {
                console.error("Échec de la requête pour récupérer les zones.");
            }
        } catch (error) {
            console.error(
                "Une erreur s'est produite lors de la récupération des zones.",
                error
            );
        }
    };

    const fetchServices = async () => {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/about.json`,
                {
                    headers: {
                        Authorization: `Bearer ${cookies?.user?.access_token}`,
                    },
                }
            );
            if (response.status === StatusCodes.OK) {
                setServices(response?.data?.server?.services);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAllServices = async () => {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/oauth2/authorization`,
                {
                    headers: {
                        Authorization: `Bearer ${cookies?.user?.access_token}`,
                    },
                }
            );
            if (response.status === StatusCodes.OK) {
                setAllServices(response?.data?.Authorizations);
            }
        } catch (error) {
            console.error(`Error during network request: ${error}`);
        }
    };

    const handleDelete = async () => {
        await context?.API.deleteArea(area.title);
        setIsFetchAreas((isFetchAreas) => !isFetchAreas);
        setArea(defaultArea);
        setModalShow(false);
    };

    const handleSubmit = async () => {
        try {
            if (!checkForm()) {
                throw new Error("Invalid form");
            }
            const newArea = {
                name: area?.title,
                description: area?.description,
                Action: {
                    service: services[area?.actionService]?.name,
                    id: area?.actionId,
                    data: area?.actionData || {},
                },
                Reaction: {
                    service: services[area?.reactionService]?.name,
                    id: area?.reactionId,
                    data: area?.reactionData || {},
                },
            };
            const responseRaw = await fetch(
                `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/area`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${cookies?.user?.access_token}`,
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(newArea),
                }
            );
            const response = await responseRaw.json();
            if (response.statusCode === 201) {
                setAreas((oldAreas) => [
                    ...oldAreas,
                    { ...newArea, isActive: true, isDone: false },
                ]);
                closeModal();
            } else {
                alert(response.message);
            }
        } catch (error) {
            if (error instanceof Error) {
            }
            console.error(error);
        }
    };

    const previousForm = () => {
        const forms = document.getElementById("forms");
        if (forms && formPage > 1) {
            forms.style.transform = `translateX(${(formPage - 2) * -100}%)`;
            setFormPage((formPage) => --formPage);
        }
    };

    const nextForm = () => {
        const forms = document.getElementById("forms");
        if (forms && formPage >= 1 && formPage < formLastPage) {
            forms.style.transform = `translateX(${formPage * -100}%)`;
            setFormPage((formPage) => ++formPage);
        }
    };

    const ModalComponent = ({
        title,
        service,
        serviceName,
        data,
        description,
    }: {
        title: string;
        service: number;
        serviceName: String;
        data: { key: string; value: string }[] | [];
        description: String;
    }) => (
        <div className={styles["actionReactionBox"]}>
            <div className={styles["header"]}>
                <h1>{title}</h1>
            </div>
            <img
                src={
                    service !== -1
                        ? require(`../../assets/${serviceName}.png`)
                        : require("../../assets/unknown.png")
                }
                alt={`${title} logo`}
                className={styles["logo"]}
            />
            <h2>{description}</h2>
            <div
                style={{
                    width: "100%",
                    gap: 5,
                }}
            >
                {data.map(({ key, value }) => {
                    return (
                        <div key={key} className={styles["data"]}>
                            <label>{key}:</label>
                            <div className={styles["value"]}>
                                {value.length ? value : "..."}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderLabel = (labelText: string) => {
        let dataValue: string = labelText;
        let required: boolean = true;

        if (dataValue && dataValue.indexOf("*optional*") !== -1) {
            dataValue = dataValue.replace("*optional*", "");
            required = false;
        }
        if (dataValue && dataValue.indexOf("*boolean*") !== -1) {
            dataValue = dataValue.replace("*boolean*", "");
        }
        return (
            <>
                {dataValue}
                {required ? <span className="required"> *</span> : null}
            </>
        );
    };

    useEffect(() => {
        fetchServices();
        fetchAllServices();
    }, []);

    useEffect(() => {
        fetchAreas();
    }, [isFetchAreas]);

    return (
        <>
            <div className={styles["container"]}>
                <Modal
                    isOpen={modalShow}
                    onRequestClose={closeModalShow}
                    style={customStylesShow}
                >
                    <div className={styles["modalContainerShow"]}>
                        {area.isDone ? (
                            <div className={styles["done"]}>
                                <div className={styles["done__title"]}>
                                    This area is done...
                                </div>
                                <div className={styles["done__content"]}>
                                    You can delete it if you want
                                </div>
                            </div>
                        ) : null}
                        <div className={styles["header"]}>
                            <h1>{area.title}</h1>
                            <div className={styles["switchZone"]}>
                                {tmpState ? "Active" : "Idle"}
                                <input
                                    className={`${styles["switch"]} ${
                                        tmpState ? styles["active"] : ""
                                    }`}
                                    type="checkbox"
                                    onChange={() =>
                                        !area.isDone
                                            ? setTmpState(!tmpState)
                                            : null
                                    }
                                />
                            </div>
                        </div>
                        <div className={styles["body"]}>
                            <div className={styles["actionReactionGrid"]}>
                                <ModalComponent
                                    title="Action"
                                    service={area.actionService}
                                    serviceName={
                                        services[area.actionService]?.name || ""
                                    }
                                    description={
                                        services[area.actionService]?.actions[
                                            area.actionId
                                        ]?.description
                                    }
                                    data={
                                        area.actionData
                                            ? Object.entries(
                                                  area.actionData
                                              ).map(([key, value]) => ({
                                                  key,
                                                  value,
                                              }))
                                            : []
                                    }
                                />
                                <ModalComponent
                                    title="Reaction"
                                    service={area.reactionService}
                                    serviceName={
                                        services[area.reactionService]?.name ||
                                        ""
                                    }
                                    description={
                                        services[area.reactionService]
                                            ?.reactions[area.reactionId]
                                            ?.description
                                    }
                                    data={
                                        area.reactionData
                                            ? Object.entries(
                                                  area.reactionData
                                              ).map(([key, value]) => ({
                                                  key,
                                                  value,
                                              }))
                                            : []
                                    }
                                />
                                <BiChevronsRight className={styles["icon"]} />
                            </div>
                            <div>
                                <h1>Description</h1>
                                <h2>{area.description}</h2>
                            </div>
                        </div>
                        <div className={styles["footer"]}>
                            <button onClick={closeModalShow}>Back</button>
                            <button
                                className={styles["delete"]}
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={modal}
                    onRequestClose={closeModal}
                    style={customStyles}
                >
                    <div className={styles["modalContainer"]}>
                        <div className={styles["headerModal"]}>
                            {modalMod === ModalMod.ADD ? "Add" : "SHOW"} Area
                        </div>
                        <div id="bodyModal" className={styles["bodyModal"]}>
                            <div id="forms" className={styles["forms"]}>
                                <div id="form1" className={`${styles["form"]}`}>
                                    <div className={styles["formInput"]}>
                                        <label>
                                            title
                                            <span className="required"> *</span>
                                        </label>
                                        <div
                                            id="title"
                                            className={styles["inputBox"]}
                                        >
                                            <input
                                                type="text"
                                                name="title"
                                                // placeholder="example@gmail.com"
                                                maxLength={999}
                                                value={area?.title}
                                                onChange={(e) => {
                                                    setArea({
                                                        ...area,
                                                        title: e?.target?.value,
                                                    });
                                                    // if (checkErrors) {
                                                    //     checkEmail();
                                                    // }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles["formInput"]}>
                                        <label>
                                            description
                                            <span className="required"> *</span>
                                        </label>
                                        <div
                                            id="description"
                                            className={`${styles["inputBox"]} ${styles["descBox"]}`}
                                        >
                                            <textarea
                                                name="description"
                                                spellCheck="false"
                                                // placeholder="example@gmail.com"
                                                maxLength={maxDescLength}
                                                value={area?.description}
                                                onChange={(e) => {
                                                    setArea({
                                                        ...area,
                                                        description:
                                                            e?.target?.value,
                                                    });
                                                    // if (checkErrors) {
                                                    //     checkEmail();
                                                    // }
                                                }}
                                            />
                                            <div
                                                className={styles["descLength"]}
                                            >
                                                {maxDescLength -
                                                    area.description.length}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="form2" className={styles["form"]}>
                                    <div className={styles["formInput"]}>
                                        <label>
                                            service
                                            <span className="required"> *</span>
                                        </label>
                                        <div className={styles["switchBox"]}>
                                            <input
                                                className={`${
                                                    styles["switch"]
                                                } ${
                                                    onlyLinked
                                                        ? styles["active"]
                                                        : ""
                                                }`}
                                                type="checkbox"
                                                onChange={() =>
                                                    setOnlyLinked(
                                                        (onlyLinked) =>
                                                            !onlyLinked
                                                    )
                                                }
                                            />
                                            <div
                                                className={styles["switchInfo"]}
                                            >
                                                Only linked services
                                            </div>
                                        </div>
                                        <div
                                            className={`${styles["servicesList"]} scroll-1`}
                                        >
                                            {services.map((service, index) => {
                                                if (
                                                    onlyLinked &&
                                                    !allServices.find(
                                                        (serviceItem: string) =>
                                                            serviceItem ===
                                                            service.name
                                                    )
                                                ) {
                                                    return;
                                                }
                                                return (
                                                    <div
                                                        className={`${
                                                            styles[
                                                                "serviceCard"
                                                            ]
                                                        } ${
                                                            index ===
                                                            area.actionService
                                                                ? styles[
                                                                      "selectedCard"
                                                                  ]
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            setArea({
                                                                ...area,
                                                                actionService:
                                                                    index,
                                                                actionId: -1,
                                                                actionData: {},
                                                            })
                                                        }
                                                        key={index}
                                                    >
                                                        {(() => {
                                                            const serviceLogo =
                                                                ServicesLogo.find(
                                                                    (item) =>
                                                                        item.name ===
                                                                        service.name
                                                                );
                                                            return (
                                                                <img
                                                                    className={
                                                                        styles[
                                                                            "logo"
                                                                        ]
                                                                    }
                                                                    src={
                                                                        serviceLogo
                                                                            ? require(`../../assets/${serviceLogo.path}`)
                                                                            : require("../../assets/unknown.png")
                                                                    }
                                                                    alt="service logo"
                                                                />
                                                            );
                                                        })()}
                                                        {service.name}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className={styles["formInput"]}>
                                        <label>
                                            action
                                            <span className="required"> *</span>
                                        </label>
                                        <div className={styles["inputBox"]}>
                                            <select
                                                onChange={(e) =>
                                                    setArea({
                                                        ...area,
                                                        actionId: parseInt(
                                                            e?.target?.value
                                                        ),
                                                        actionData: {},
                                                    })
                                                }
                                                value={area?.actionId}
                                            >
                                                <option
                                                    hidden
                                                    disabled
                                                    value={-1}
                                                >
                                                    Select an action
                                                </option>
                                                {area?.actionService !== -1 ? (
                                                    services[
                                                        area?.actionService
                                                    ]?.actions.map(
                                                        (action, index) => (
                                                            <option
                                                                key={index}
                                                                value={index}
                                                            >
                                                                {
                                                                    action.description
                                                                }
                                                            </option>
                                                        )
                                                    )
                                                ) : (
                                                    <option disabled={true}>
                                                        You must first select a
                                                        service
                                                    </option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    {area.actionService !== -1 &&
                                    area.actionId !== -1 &&
                                    services[area.actionService] &&
                                    services[area.actionService]?.actions[
                                        area.actionId
                                    ]?.data
                                        ? Object.keys(
                                              services[area.actionService]
                                                  .actions[area.actionId].data
                                          ).map((key) =>
                                              (() => {
                                                  if (
                                                      services[
                                                          area.actionService
                                                      ]?.actions[
                                                          area.actionId
                                                      ]?.data[key]?.indexOf(
                                                          "*boolean*"
                                                      ) !== -1 &&
                                                      (!area.actionData ||
                                                          !area.actionData[key])
                                                  ) {
                                                      setArea((prevArea) => ({
                                                          ...prevArea,
                                                          actionData: {
                                                              ...prevArea.actionData,
                                                              [key]: "undefined",
                                                          },
                                                      }));
                                                  }
                                                  return (
                                                      <div
                                                          key={key}
                                                          className={
                                                              styles[
                                                                  "formInput"
                                                              ]
                                                          }
                                                      >
                                                          <label>
                                                              {renderLabel(
                                                                  services[
                                                                      area
                                                                          .actionService
                                                                  ].actions[
                                                                      area
                                                                          .actionId
                                                                  ].data[key]
                                                              )}
                                                          </label>
                                                          {services[
                                                              area.actionService
                                                          ].actions[
                                                              area.actionId
                                                          ].data[key].indexOf(
                                                              "*boolean*"
                                                          ) === -1 ? (
                                                              <div
                                                                  id={key}
                                                                  className={
                                                                      styles[
                                                                          "inputBox"
                                                                      ]
                                                                  }
                                                              >
                                                                  <input
                                                                      type="text"
                                                                      name={key}
                                                                      value={
                                                                          area.actionData &&
                                                                          area
                                                                              .actionData[
                                                                              key
                                                                          ]
                                                                              ? area
                                                                                    .actionData[
                                                                                    key
                                                                                ]
                                                                              : ""
                                                                      }
                                                                      onChange={(
                                                                          e
                                                                      ) => {
                                                                          setArea(
                                                                              (
                                                                                  prevArea
                                                                              ) => ({
                                                                                  ...prevArea,
                                                                                  actionData:
                                                                                      {
                                                                                          ...prevArea.actionData,
                                                                                          [key]: e
                                                                                              .target
                                                                                              .value,
                                                                                      },
                                                                              })
                                                                          );
                                                                      }}
                                                                  />
                                                              </div>
                                                          ) : (
                                                              <div
                                                                  className={
                                                                      styles[
                                                                          "switchBox"
                                                                      ]
                                                                  }
                                                              >
                                                                  <input
                                                                      className={`${
                                                                          styles[
                                                                              "switch"
                                                                          ]
                                                                      } ${
                                                                          area?.actionData &&
                                                                          area
                                                                              .actionData[
                                                                              key
                                                                          ] ===
                                                                              "undefined"
                                                                              ? styles[
                                                                                    "undefined"
                                                                                ]
                                                                              : area?.actionData &&
                                                                                area
                                                                                    .actionData[
                                                                                    key
                                                                                ] ===
                                                                                    "true"
                                                                              ? styles[
                                                                                    "active"
                                                                                ]
                                                                              : ""
                                                                      }`}
                                                                      type="checkbox"
                                                                      onChange={() =>
                                                                          setArea(
                                                                              (
                                                                                  prevArea
                                                                              ) => {
                                                                                  const newActionData =
                                                                                      {
                                                                                          ...(prevArea.actionData ||
                                                                                              {}),
                                                                                          [key]:
                                                                                              area?.actionData &&
                                                                                              area
                                                                                                  .actionData[
                                                                                                  key
                                                                                              ] ===
                                                                                                  "true"
                                                                                                  ? "false"
                                                                                                  : "true",
                                                                                      };

                                                                                  return {
                                                                                      ...prevArea,
                                                                                      actionData:
                                                                                          newActionData,
                                                                                  };
                                                                              }
                                                                          )
                                                                      }
                                                                  />
                                                                  <GrPowerReset
                                                                      className={
                                                                          styles[
                                                                              "resetSwitch"
                                                                          ]
                                                                      }
                                                                      onClick={() => {
                                                                          setArea(
                                                                              (
                                                                                  prevArea
                                                                              ) => ({
                                                                                  ...prevArea,
                                                                                  actionData:
                                                                                      {
                                                                                          ...prevArea.actionData,
                                                                                          [key]: "undefined",
                                                                                      },
                                                                              })
                                                                          );
                                                                      }}
                                                                  />
                                                                  {area?.actionData &&
                                                                  area
                                                                      .actionData[
                                                                      key
                                                                  ] ===
                                                                      "undefined" ? (
                                                                      <div
                                                                          className={
                                                                              styles[
                                                                                  "switchInfo"
                                                                              ]
                                                                          }
                                                                      >
                                                                          (This
                                                                          field
                                                                          is
                                                                          currently
                                                                          undefined)
                                                                      </div>
                                                                  ) : null}
                                                              </div>
                                                          )}
                                                      </div>
                                                  );
                                              })()
                                          )
                                        : null}
                                </div>
                                <div id="form3" className={styles["form"]}>
                                    <div className={styles["formInput"]}>
                                        <label>
                                            service
                                            <span className="required"> *</span>
                                        </label>
                                        <div className={styles["switchBox"]}>
                                            <input
                                                className={`${
                                                    styles["switch"]
                                                } ${
                                                    onlyLinked
                                                        ? styles["active"]
                                                        : ""
                                                }`}
                                                type="checkbox"
                                                onChange={() =>
                                                    setOnlyLinked(
                                                        (onlyLinked) =>
                                                            !onlyLinked
                                                    )
                                                }
                                            />
                                            <div
                                                className={styles["switchInfo"]}
                                            >
                                                Only linked services
                                            </div>
                                        </div>
                                        <div className={styles["servicesList"]}>
                                            {services.map((service, index) => {
                                                if (
                                                    onlyLinked &&
                                                    !allServices.find(
                                                        (serviceItem: string) =>
                                                            serviceItem ===
                                                            service.name
                                                    )
                                                ) {
                                                    return;
                                                }
                                                return (
                                                    <div
                                                        className={`${
                                                            styles[
                                                                "serviceCard"
                                                            ]
                                                        } ${
                                                            index ===
                                                            area.reactionService
                                                                ? styles[
                                                                      "selectedCard"
                                                                  ]
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            setArea({
                                                                ...area,
                                                                reactionService:
                                                                    index,
                                                                reactionId: -1,
                                                                reactionData:
                                                                    {},
                                                            })
                                                        }
                                                        key={index}
                                                    >
                                                        {(() => {
                                                            const serviceLogo =
                                                                ServicesLogo.find(
                                                                    (item) =>
                                                                        item.name ===
                                                                        service.name
                                                                );
                                                            return (
                                                                <img
                                                                    className={
                                                                        styles[
                                                                            "logo"
                                                                        ]
                                                                    }
                                                                    src={
                                                                        serviceLogo
                                                                            ? require(`../../assets/${serviceLogo.path}`)
                                                                            : require("../../assets/unknown.png")
                                                                    }
                                                                    alt="service logo"
                                                                />
                                                            );
                                                        })()}
                                                        {service.name}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className={styles["formInput"]}>
                                        <label>
                                            reaction
                                            <span className="required"> *</span>
                                        </label>
                                        <div className={styles["inputBox"]}>
                                            <select
                                                onChange={(e) =>
                                                    setArea({
                                                        ...area,
                                                        reactionId: parseInt(
                                                            e?.target?.value
                                                        ),
                                                        reactionData: {},
                                                    })
                                                }
                                                value={area?.reactionId}
                                            >
                                                <option
                                                    hidden
                                                    disabled
                                                    value={-1}
                                                >
                                                    Select a reaction
                                                </option>
                                                {area?.reactionService !==
                                                -1 ? (
                                                    services[
                                                        area?.reactionService
                                                    ]?.reactions.map(
                                                        (reaction, index) => (
                                                            <option
                                                                key={index}
                                                                value={index}
                                                            >
                                                                {
                                                                    reaction.description
                                                                }
                                                            </option>
                                                        )
                                                    )
                                                ) : (
                                                    <option disabled={true}>
                                                        You must first select a
                                                        service
                                                    </option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    {area.reactionService !== -1 &&
                                    area.reactionId !== -1 &&
                                    services[area.reactionService] &&
                                    services[area.reactionService]?.reactions[
                                        area.reactionId
                                    ]?.data
                                        ? Object.keys(
                                              services[area.reactionService]
                                                  .reactions[area.reactionId]
                                                  .data
                                          ).map((key) =>
                                              (() => {
                                                  if (
                                                      services[
                                                          area.reactionService
                                                      ]?.reactions[
                                                          area.reactionId
                                                      ]?.data[key]?.indexOf(
                                                          "*boolean*"
                                                      ) !== -1 &&
                                                      (!area.reactionData ||
                                                          !area.reactionData[
                                                              key
                                                          ])
                                                  ) {
                                                      setArea((prevArea) => ({
                                                          ...prevArea,
                                                          reactionData: {
                                                              ...prevArea.reactionData,
                                                              [key]: "undefined",
                                                          },
                                                      }));
                                                  }
                                                  return (
                                                      <div
                                                          key={key}
                                                          className={
                                                              styles[
                                                                  "formInput"
                                                              ]
                                                          }
                                                      >
                                                          <label>
                                                              {renderLabel(
                                                                  services[
                                                                      area
                                                                          .reactionService
                                                                  ]?.reactions[
                                                                      area
                                                                          .reactionId
                                                                  ]?.data[key]
                                                              )}
                                                          </label>
                                                          {services[
                                                              area
                                                                  .reactionService
                                                          ].reactions[
                                                              area.reactionId
                                                          ].data[key].indexOf(
                                                              "*boolean*"
                                                          ) === -1 ? (
                                                              <div
                                                                  id={key}
                                                                  className={
                                                                      styles[
                                                                          "inputBox"
                                                                      ]
                                                                  }
                                                              >
                                                                  <input
                                                                      type="text"
                                                                      name={key}
                                                                      value={
                                                                          area?.reactionData &&
                                                                          area
                                                                              .reactionData[
                                                                              key
                                                                          ]
                                                                              ? area
                                                                                    .reactionData[
                                                                                    key
                                                                                ]
                                                                              : ""
                                                                      }
                                                                      onChange={(
                                                                          e
                                                                      ) => {
                                                                          setArea(
                                                                              (
                                                                                  prevArea
                                                                              ) => ({
                                                                                  ...prevArea,
                                                                                  reactionData:
                                                                                      {
                                                                                          ...prevArea.reactionData,
                                                                                          [key]: e
                                                                                              .target
                                                                                              .value,
                                                                                      },
                                                                              })
                                                                          );
                                                                      }}
                                                                  />
                                                              </div>
                                                          ) : (
                                                              <div
                                                                  className={
                                                                      styles[
                                                                          "switchBox"
                                                                      ]
                                                                  }
                                                              >
                                                                  <input
                                                                      className={`${
                                                                          styles[
                                                                              "switch"
                                                                          ]
                                                                      } ${
                                                                          area?.reactionData &&
                                                                          area
                                                                              .reactionData[
                                                                              key
                                                                          ] ===
                                                                              "undefined"
                                                                              ? styles[
                                                                                    "undefined"
                                                                                ]
                                                                              : area?.reactionData &&
                                                                                area
                                                                                    .reactionData[
                                                                                    key
                                                                                ] ===
                                                                                    "true"
                                                                              ? styles[
                                                                                    "active"
                                                                                ]
                                                                              : ""
                                                                      }`}
                                                                      type="checkbox"
                                                                      onChange={() =>
                                                                          setArea(
                                                                              (
                                                                                  prevArea
                                                                              ) => {
                                                                                  const newActionData =
                                                                                      {
                                                                                          ...(prevArea.reactionData ||
                                                                                              {}),
                                                                                          [key]:
                                                                                              area?.reactionData &&
                                                                                              area
                                                                                                  .reactionData[
                                                                                                  key
                                                                                              ] ===
                                                                                                  "true"
                                                                                                  ? "false"
                                                                                                  : "true",
                                                                                      };

                                                                                  return {
                                                                                      ...prevArea,
                                                                                      reactionData:
                                                                                          newActionData,
                                                                                  };
                                                                              }
                                                                          )
                                                                      }
                                                                  />
                                                                  <GrPowerReset
                                                                      className={
                                                                          styles[
                                                                              "resetSwitch"
                                                                          ]
                                                                      }
                                                                      onClick={() => {
                                                                          setArea(
                                                                              (
                                                                                  prevArea
                                                                              ) => ({
                                                                                  ...prevArea,
                                                                                  reactionData:
                                                                                      {
                                                                                          ...prevArea.reactionData,
                                                                                          [key]: "undefined",
                                                                                      },
                                                                              })
                                                                          );
                                                                      }}
                                                                  />
                                                                  {area?.reactionData &&
                                                                  area
                                                                      .reactionData[
                                                                      key
                                                                  ] ===
                                                                      "undefined" ? (
                                                                      <div
                                                                          className={
                                                                              styles[
                                                                                  "switchInfo"
                                                                              ]
                                                                          }
                                                                      >
                                                                          (This
                                                                          field
                                                                          is
                                                                          currently
                                                                          undefined)
                                                                      </div>
                                                                  ) : null}
                                                              </div>
                                                          )}
                                                      </div>
                                                  );
                                              })()
                                          )
                                        : null}
                                </div>
                            </div>
                        </div>
                        <div className={styles["footerModal"]}>
                            <button
                                onClick={() => {
                                    formPage !== 1
                                        ? previousForm()
                                        : closeModal();
                                }}
                            >
                                Back
                            </button>
                            <button
                                onClick={() => {
                                    formPage !== formLastPage
                                        ? nextForm()
                                        : handleSubmit();
                                }}
                            >
                                {formPage !== formLastPage
                                    ? "Next"
                                    : modalMod === ModalMod.ADD
                                    ? "Add"
                                    : "SHOW"}
                            </button>
                        </div>
                    </div>
                </Modal>
                <div className="component_header">
                    <h1 className="component_header_title">Areas</h1>
                    <div className="component_footer_bar" />
                </div>
                <div className={styles["header"]}>
                    <button
                        onClick={() => {
                            setModalMod(ModalMod.ADD);
                            setModal(true);
                        }}
                    >
                        Add
                    </button>
                </div>
                <div className={styles["body"]}>
                    <div className={styles["areaGrid"]}>
                        {areas.map((areaItem, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`${styles["areaCard"]} ${
                                        !areaItem?.isActive
                                            ? styles["isSleeping"]
                                            : ""
                                    }`}
                                    onClick={() => {
                                        const actionService =
                                            services?.findIndex(
                                                (item) =>
                                                    item.name ===
                                                    areaItem?.Action?.service
                                            );
                                        const reactionService =
                                            services?.findIndex(
                                                (item: Service) =>
                                                    item?.name ===
                                                    areaItem?.Reaction?.service
                                            );
                                        setArea({
                                            title: areaItem?.name,
                                            description: areaItem?.description,
                                            actionService: actionService,
                                            actionId: areaItem?.Action?.id,
                                            reactionService: reactionService,
                                            reactionId: areaItem?.Reaction?.id,
                                            isActive: areaItem?.isActive,
                                            isDone: areaItem?.isDone,
                                            actionData: areaItem?.Action?.data,
                                            reactionData:
                                                areaItem?.Reaction?.data,
                                        });
                                        setModalMod(ModalMod.SHOW);
                                        setTmpState(areaItem?.isActive);
                                        setModalShow(true);
                                    }}
                                >
                                    <div className={styles["headerAreaCard"]}>
                                        {areaItem?.name}
                                        {areaItem?.isDone ? (
                                            <MdOutlineDone
                                                className={styles["state"]}
                                            />
                                        ) : !areaItem?.isActive ? (
                                            <GiNightSleep
                                                className={styles["state"]}
                                            />
                                        ) : null}
                                    </div>
                                    <div className={styles["bodyAreaCard"]}>
                                        <div className={styles["details"]}>
                                            <div
                                                className={
                                                    styles["headerDetails"]
                                                }
                                            >
                                                Action
                                            </div>
                                            <div className={styles["service"]}>
                                                <div className={styles["logo"]}>
                                                    <img
                                                        className={
                                                            styles["logo"]
                                                        }
                                                        src={require(`../../assets/${areaItem?.Action?.service}.png`)}
                                                        alt="service logo"
                                                    />
                                                </div>
                                                {areaItem?.Action?.service}
                                            </div>
                                            <div
                                                className={
                                                    styles["description"]
                                                }
                                            >
                                                {(() => {
                                                    const service =
                                                        services?.find(
                                                            (item) =>
                                                                item?.name ===
                                                                areaItem?.Action
                                                                    ?.service
                                                        );
                                                    return (
                                                        <div>
                                                            {
                                                                service
                                                                    ?.actions[
                                                                    areaItem
                                                                        ?.Action
                                                                        ?.id
                                                                ]?.description
                                                            }
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                        <BiChevronsRight
                                            className={styles["icon"]}
                                        />
                                        <div className={styles["details"]}>
                                            <div
                                                className={
                                                    styles["headerDetails"]
                                                }
                                            >
                                                Reaction
                                            </div>
                                            <div className={styles["service"]}>
                                                <div className={styles["logo"]}>
                                                    {(() => {
                                                        const service =
                                                            ServicesLogo?.find(
                                                                (item) =>
                                                                    item?.name ===
                                                                    areaItem
                                                                        ?.Reaction
                                                                        ?.service
                                                            );
                                                        return (
                                                            <img
                                                                className={
                                                                    styles[
                                                                        "logo"
                                                                    ]
                                                                }
                                                                src={
                                                                    service
                                                                        ? require(`../../assets/${service.path}`)
                                                                        : require("../../assets/unknown.png")
                                                                }
                                                                alt="service logo"
                                                            />
                                                        );
                                                    })()}
                                                </div>
                                                {areaItem?.Reaction?.service}
                                            </div>
                                            <div
                                                className={
                                                    styles["description"]
                                                }
                                            >
                                                {(() => {
                                                    const service =
                                                        services?.find(
                                                            (item) =>
                                                                item?.name ===
                                                                areaItem
                                                                    ?.Reaction
                                                                    ?.service
                                                        );
                                                    return (
                                                        <div>
                                                            {
                                                                service
                                                                    ?.reactions[
                                                                    areaItem
                                                                        ?.Reaction
                                                                        ?.id
                                                                ]?.description
                                                            }
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Areas;

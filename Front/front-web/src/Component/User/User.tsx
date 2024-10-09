import React, { useContext, useState } from "react";
import { MainContext } from "../../Context/AllContext";
import "./User.css";

function User() {
    const context = useContext(MainContext);
    const _user_info: string | null = localStorage.getItem("user");
    const [isEditing, setIsEditing] = useState(-1);
    let user_info: { [key: string]: string } = {};
    const [editedValue, setEditedValue] = useState("");

    const handleEditInfo = (index: number, value: string) => {
        setIsEditing(index);
        setEditedValue(value);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setEditedValue(newValue);
    };

    const handleSaveChange = async (key: string) => {
        const access_token = localStorage.getItem("access_token");
        if (access_token === null) return;
        user_info[key] = editedValue;
        // localStorage.setItem("user", user_info);
        try {
            await context?.API.changeUserInfo(
                access_token,
                {
                    firstname: user_info.firstname,
                    lastname: user_info.lastname,
                    phone: user_info.phone,
                },
                user_info.email
            );
            setIsEditing(-1);
        } catch (error) {
            console.error(`Error during network request: ${error}`);
        }
    };

    if (_user_info) {
        user_info = JSON.parse(_user_info);
    }

    if (!context) {
        return <div></div>;
    }

    const { deleteAccount } = context;

    const check_value = (value: string) => {
        return value.trim() !== "";
    };

    const DisplayUserInfo = () => {
        const list = ["firstname", "lastname", "email", "phone"];
        const valuesToDisplay = [];

        for (const key in user_info) {
            if (user_info.hasOwnProperty(key) && list.includes(key)) {
                const value = user_info[key];
                if (check_value(value)) {
                    valuesToDisplay.push({ value, isEmpty: false, key: key });
                } else {
                    valuesToDisplay.push({
                        value: key,
                        isEmpty: true,
                        key: key,
                    });
                }
            }
        }

        return valuesToDisplay.map((item, index) => (
            <div className="user_card" key={index}>
                <h5 className="key_text">{item.key}</h5>
                <div className="value_text">
                    {isEditing === index ? (
                        <div>
                            <input
                                className="user_input"
                                type="text"
                                value={editedValue}
                                onChange={(event) => handleChange(event)}
                                // onBlur={handleBlur}
                            />
                            <button
                                className="save_button"
                                onClick={() => handleSaveChange(item.key)}
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <h1
                            className={
                                item.isEmpty ? "emptyValue" : "notEmptyValue"
                            }
                            onDoubleClick={() =>
                                handleEditInfo(index, user_info[item.key])
                            }
                        >
                            {user_info[item.key]}
                        </h1>
                    )}
                </div>
            </div>
        ));
    };

    return (
        <div className="component_container">
            <div className="component_header">
                <h1 className="component_header_title">User</h1>
                <div className="component_footer_bar" />
            </div>

            <div className="user_container">
                <div>{DisplayUserInfo()}</div>
                <button className="delete_button" onClick={deleteAccount}>
                    Delete account
                </button>
            </div>
        </div>
    );
}

export default User;

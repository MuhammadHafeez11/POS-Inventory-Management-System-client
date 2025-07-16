import React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "semantic-ui-react";
import { BsDot } from "react-icons/bs";
const LanguageSwitcher = () => {
  const {t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  const languageOptions = [
    { key: "en", value: "en", text: "English" },
    { key: "ur", value: "ur", text: "Urdu" },
  ];

  return (
    <div className="DropdownDiv">
      {/* <BsDot /> */}
      {/* <p className="LanguageDot"></p> */}
      {/* <p>{t("PreferredLanguage")}</p> */}
      <Dropdown
        button
        // className="languageDropDown"
        floating
        labeled
        options={languageOptions}
        defaultValue={i18n.language}
        onChange={(event, data) => changeLanguage(data.value)}
      />
    </div>
  );
};

export default LanguageSwitcher;
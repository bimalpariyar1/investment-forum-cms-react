import React from "react";
import SinglePage from "layouts/SinglePage";
import SpeakerForm from "../../speaker-form";
const AddSpeaker = () => {
  return (
    <SinglePage pageTitle="Add Speaker" backLink="/panel-discussion">
      <SpeakerForm mode="ADD" />
    </SinglePage>
  );
};

export default AddSpeaker;

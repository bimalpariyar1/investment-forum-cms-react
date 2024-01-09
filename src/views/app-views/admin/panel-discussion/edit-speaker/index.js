import React from "react";
import SinglePage from "layouts/SinglePage";
import SpeakerForm from "../../speaker-form";
const EditSpeaker = (props) => {
  return (
    <SinglePage pageTitle="Edit Speaker" backLink="/panel-discussion">
      <SpeakerForm mode="EDIT" params={props.match.params.id} />
    </SinglePage>
  );
};

export default EditSpeaker;

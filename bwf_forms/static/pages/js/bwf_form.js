var bwf_form = {
  var: {
    form: null,
    base_url: "/bwf/api/form-setup/",
    base_versions_url: "/bwf/forms/api/form-version/",
  },

  init: function () {
    const _ = forms_dashboard;

    _.var.hasInit = false;
    _.init();
  },
  navigate: {
    toVersionEdition: function (form_id, version_id) {
      window.location = `/bwf/forms/editor/${version_id}/`;
    },
  },
  api: {
    createForm: function (data) {
      const _ = forms_dashboard;

      return new Promise((resolve, reject) => {
        $.ajax({
          url: _.var.url,
          type: "POST",
          headers: { "X-CSRFToken": $("#csrf_token").val() },
          contentType: "application/json",
          data: JSON.stringify({ ...data }),
          success: function (response) {
            resolve(response);
          },
          error: function (error) {
            alert("Error creating form");
            reject(error);
          },
        });
      });
    },
    createFormVersion: function (data) {
      const _ = bwf_form;

      return new Promise((resolve, reject) => {
        $.ajax({
          url: _.var.base_versions_url,
          type: "POST",
          headers: { "X-CSRFToken": $("#csrf_token").val() },
          contentType: "application/json",
          data: JSON.stringify({ ...data }),
          success: function (response) {
            resolve(response);
          },
          error: function (error) {
            alert("Error creating form version");
            reject(error);
          },
        });
      });
    },
    markVersionAsCurrent: function (version_object_id, version_id) {
      const _ = bwf_form;

      return new Promise((resolve, reject) => {
        $.ajax({
          url: `${_.var.base_versions_url}${version_object_id}/mark_form_active_version/?version_id=${version_id}`,
          type: "POST",
          headers: { "X-CSRFToken": $("#csrf_token").val() },
          success: function (response) {
            resolve(response);
          },
          error: function (error) {
            alert("Error marking version as current");
            reject(error);
          },
        });
      });
    },
  },
};

forms_editor = {
  var: {
    url: "/bwf/forms/api/form-version",
    form_id: null,
    version_id: null,
    version_object_id: null,
    builder: null,
    attempt: 0,
    timeout: null,
  },
  elem: {},

  init: function (data) {
    const _ = forms_editor;
    const {form_id, version_id, version_object_id} = data
    _.var.form_id = form_id;
    _.var.version_id = version_id;
    _.var.version_object_id = version_object_id;

    if (!_.var.form_id || !_.var.version_id) {
      console.error("Form ID and Version ID are required.");
      return;
    }

    _.api
      .getForm(_.var.form_id, _.var.version_id)
      .then((data) => {
        const container = $("#form-editor-container");
        container.formBuilder({
          formStructure: data,
          isDev: true,
        });
        container.formBuilder("build");
        _.var.builder = container.formBuilder("widget");
        container.on("formbuilder-updated", _, function (e) {
          const _ = e.data;
          const { structure } = e.detail;

          _.debounce(_.updateStructure, 600)(structure);
        });
      })
      .catch((error) => {
        console.error("Error fetching form data:", error);
      });
  },

  render: function () {},

  updateStructure: function (structure) {
    const _ = forms_editor;
    const { version_object_id, version_id } = _.var;
    _.api
      .updateFormStructure(version_object_id, version_id, structure)
      .then((data) => {
        console.log("Form structure updated successfully:", data);
      })
      .catch((error) => {
        console.error("Error updating form structure:", error);
      });
  },

  debounce: function (func, delay) {
    const _ = forms_editor;

    if (_.var.timeout) {
      clearTimeout(_.var.timeout);
    }

    return function (...args) {
      const context = this;
      clearTimeout(_.var.timeout);
      _.var.timeout = setTimeout(() => func.apply(context, args), delay);
    };
  },

  api: {
    getForm: function (form_id, version_id) {
      const _ = forms_editor;

      return new Promise((resolve, reject) => {
        $.ajax({
          url: `${_.var.url}/${form_id}/get_json_form/?version_id=${version_id}`,
          type: "GET",
          dataType: "json",
          success: function (data) {
            resolve(data);
          },
          error: function (xhr, status, error) {
            reject(error);
          },
        });
      });
    },

    updateFormStructure: function (version_object_id, version_id, structure) {
      const _ = forms_editor;
      const data = {
        form_structure: structure,
      };
      return new Promise((resolve, reject) => {
        $.ajax({
          url: `${_.var.url}/${version_object_id}/?version_id=${version_id}`,
          type: "PUT",
          contentType: "application/json",
          data: JSON.stringify(data),
          headers: {
            "X-CSRFToken": $("#csrf_token").val(),
          },
          success: function (data) {
            resolve(data);
          },
          error: function (xhr, status, error) {
            reject(error);
          },
        });
      });
    },

    markActiveVersion: function () {
      const _ = forms_editor;
      const { form_id, version_id, version_object_id} = _.var;
      return new Promise((resolve, reject) => {
        $.ajax({
          url: `${_.var.url}/${version_object_id}/mark_form_active_version/?version_id=${version_id}`,
          type: "POST",
          headers: {
            "X-CSRFToken": $("#csrf_token").val(),
          },
          success: function (data) {
            resolve(data);
          },
          error: function (xhr, status, error) {
            reject(error);
          },
        });
      });
    }
  },
};

forms_editor = {
  var: {
    url: "/bwf/forms/api/form-version",
    form_id: null,
    version_id: null,
  },
  elem: {},

  init: function (form_id, version_id) {
    const _ = forms_editor;

    _.var.form_id = form_id;
    _.var.version_id = version_id;

    if (!_.var.form_id || !_.var.version_id) {
      console.error("Form ID and Version ID are required.");
      return;
    }

    _.api
      .getForm(_.var.form_id, _.var.version_id)
      .then((data) => {
        $('#form-editor-container').formBuilder({
                formData: data || [],
                // submission: {
                //   urL: 'http://'
                // },
                API_KEY: 'AXAKSDHASKJDHAKSJHDLAKSHDASDFHASDHFJKL',
                initialValue: {
                    firstName: 'Roberto',
                    emailField: 'robe@extremoduro.com',
                    people: [
                    {
                        selectBoxes: ['john.doe@test.com'],
                        checkboxControl: true,
                    },
                    ],
                    datePicker: [new Date('2024-10-30T16:00:00.000Z'), new Date('2024-10-21T16:00:00.000Z')],
                    table: [
                    {
                        textField1: 'sadf',
                        inputNumber: 123,
                        selectBoxes1: ['john.doe@test.com', 'jane.doe@test.com'],
                        datePicker1: new Date('2024-11-11T16:00:00.000Z'),
                    },
                    ],
                },
                onSuccess: (data) => {
                    console.log('Form submitted successfully:', data);
                },
                onError: (error) => {
                    alert('Error submitting form. Please try again.');
                    console.error('Form submission error:', error);
                }
                });
                $('#form-editor-container').formBuilder('build');
      })
      .catch((error) => {
        console.error("Error fetching form data:", error);
      });
  },

  render: function () {},

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

    updateDefinition: function (form_id, version_id, definition) {
      const _ = forms_editor;
      const data = {
        definition: definition,
      };
      return new Promise((resolve, reject) => {
        $.ajax({
          url: `${_.var.url}/${form_id}/?version_id=${version_id}`,
          type: "PUT",
          contentType: "application/json",
          data: JSON.stringify(data),
          success: function (data) {
            resolve(data);
          },
          error: function (xhr, status, error) {
            reject(error);
          },
        });
      });
    },
  },
};

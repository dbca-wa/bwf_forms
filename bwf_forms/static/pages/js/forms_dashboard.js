var forms_dashboard = {
  dt: null,
  progressBar: null,
  progressContainer: null,
  var: {
    hasInit: false,
    page: 1,
    page_size: 10,
    search: "",
    url: "/bwf/forms/api/form/",
    data: [],
    breadcrumb: [],
    root: "",
    location: "",
    isDownloading: false,
  },
  elem: {
    newFormButton: null,
  },

  init: function () {
    const _ = forms_dashboard;
    const params = new URL(document.location.toString()).searchParams;

    _.var.hasInit = false;
    _.var.page = Number(params.get("page")) || 1;
    _.var.page_size = Number(params.get("page_size")) || 10;

    _.var.search = params.get("search") ?? "";

    _.var.location = window.location.href.split("?")[0];

    _.elem.newFormButton = $("#new-form-btn");
    _.addFormButton();
    _.renderDataTable();
  },
  addFormButton: function () {
    const _ = forms_dashboard;
    _.elem.newFormButton.on("click", function (e) {
      const _ = forms_dashboard;

      $("#form-creation-modal").modal("show");
    });
  },
  renderDataTable: function () {
    const _ = forms_dashboard;
    _.dt = $("#forms_dashboard table").DataTable({
      serverSide: true,

      language: utils.datatable.common.language,
      ajax: function (data, callback, settings) {
        if (!_.var.hasInit) {
          _.var.hasInit = true;
        } else {
          _.var.page = data && data.start ? data.start / data.length + 1 : 1;
          _.var.page_size = data?.length;
          _.var.search = data?.search?.value;
        }
        _.elem.newFormButton.attr("disabled", true);

        _.api.get_datatable_data(
          {
            page: _.var.page,
            page_size: _.var.page_size,
            search: _.var.search,
            draw: data?.draw,
          },
          function (response) {
            const { count, results } = response;
            _.elem.newFormButton.removeAttr("disabled");
            callback({
              data: results,
              recordsTotal: count,
              recordsFiltered: count,
            });
          },
          function (error) {
            console.error(error);
            alert("There was an error fetching the files");
          }
        );
      },
      headerCallback: function (thead, data, start, end, display) {
        $(thead).addClass("table-light");
      },

      columns: [
        {
          title: "Form",
          data: "name",
          render: function (data, type, row) {
            const { markup } = utils;
            return markup(
              "div",
              [
                {
                  tag: "div",
                  content: [
                    {
                      tag: "span",
                      content: row.name,
                      class: "",
                    },
                  ],
                  class: "",
                },
              ],
              {
                class: "row-hash",
                "data-id": row.id,
              }
            );
          },
        },
        {
          title: "Created at",
          data: "created_at",
          render: function (data, type, row) {
            const { markup } = utils;
            return markup("div", moment(data).format("DD MMM YYYY HH:mm:ss a"));
          },
        },
        {
          title: "Last Updated",
          data: "updated_at",
          render: function (data, type, row) {
            if (!data) return " - ";
            const { markup } = utils;
            return markup("div", moment(data).format("DD MMM YYYY HH:mm:ss a"));
          },
        },
      ],
    });

    _.dt.state({
      start: (_.var.page - 1) * _.var.page_size,
      length: _.var.page_size,
      route_path: _.var.route_path,
    });
    _.dt.search(_.var.search);
  },
  navigate: {
    toVersionEdition: function (workflow_id, version_id) {
      window.location = `/bwf/forms/editor/${version_id}`;
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

    get_datatable_data: function (params, cb_success, cb_error) {
      const _ = forms_dashboard;
      const _params = {
        page: params?.page ?? _.var.page,
        page_size: params?.page_size ?? _.var.page_size,
        search: params?.search ?? "",
      };
      const queryParams = utils.make_query_params(_params);
      history.replaceState(null, null, "?" + queryParams.toString());

      $.ajax({
        url: _.var.url + "?" + queryParams,
        method: "GET",
        dataType: "json",
        contentType: "application/json",
        success: cb_success,
        error: cb_error,
      });
    },
  },
};

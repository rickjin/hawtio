module Osgi {

    export function ServiceController($scope, $filter:ng.IFilterService, workspace:Workspace, $templateCache:ng.ITemplateCacheService, $compile:ng.IAttributes) {
        var dateFilter = $filter('date');

        $scope.widget = new TableWidget($scope, workspace, [
            {
                "mDataProp": null,
                "sClass": "control center",
                "sDefaultContent": '<i class="icon-plus"></i>'
            },
            { "mDataProp": "Identifier" },
            { "mDataProp": "BundleIdentifier" },
            { "mDataProp": "objectClass" }
        ], {
            rowDetailTemplateId: 'osgiServiceTemplate',
            disableAddColumns: true
        });



        $scope.$watch('workspace.selection', function () {
            var mbean = getSelectionServiceMBean(workspace);
            if (mbean) {
                var jolokia = workspace.jolokia;
                jolokia.request(
                        {type: 'exec', mbean: mbean, operation: 'listServices()'},
                        onSuccess(populateTable));
            }
        });

        var populateTable = function (response) {
            Osgi.defaultServiceValues(workspace, $scope, response.value);
            $scope.widget.populateTable(response.value);
            $scope.$apply();
        };
    }
};


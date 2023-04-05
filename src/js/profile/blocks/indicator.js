import {Chart} from '../chart';
import {ContentBlock} from './content_block';
import {SidePanels} from "../../elements/side_panels";

export class Indicator extends ContentBlock {
    constructor(
        parent,
        container,
        indicator,
        title,
        isLast,
        geography,
        chartAttribution,
        addLockButton = true,
        restrictValues = {},
        defaultFilters = [],
        hiddenIndicators = []
    ) {
        super(parent, container, indicator, title, isLast, geography);
        this.chartAttribution = chartAttribution;
        this._chart = null;
        this.prepareDomElements();
        this.addIndicatorChart(addLockButton, restrictValues, defaultFilters);
        this._isVisible = !hiddenIndicators.includes(indicator.id);
        if (!this._isVisible){
          $(this.container).hide();
        }
    }

    get isVisible(){
      return this._isVisible;
    }

    set isVisible(value){
      if (!value){
        $(this.container).hide();
      } else {
        $(this.container).show();
      }
      this._isVisible = value;
      this.parent.updateVisibility();
    }

    get previouslySelectedFilters() {
        if (this.parent.filteredIndicators === undefined) {
            return [];
        } else {
            let previouslySelectedFilters = this.parent.filteredIndicators.filter(x => x.indicatorId === this.indicator.id
                && x.filters.filter(y => y.appliesTo.indexOf(SidePanels.PANELS.richData) >= 0).length > 0);

            let tempObj = structuredClone(previouslySelectedFilters);

            tempObj.forEach(x => {
                x.filters = x.filters.filter(x => x.appliesTo.indexOf(SidePanels.PANELS.richData) >= 0);
            });

            return tempObj;
        }
    }

    get siteWideFilters() {
        return this.parent.siteWideFilters;
    }

    get hasData() {
        return this.indicator.data.some(function (e) {
            return e.count > 0
        });
    }

    get chart() {
        return this._chart;
    }

    prepareDomElements() {
        super.prepareDomElements();
    }

    addIndicatorChart(addLockButton, restrictValues, defaultFilters) {
        let groups = Object.keys(this.indicator.groups);
        const configuration = this.indicator.chartConfiguration;

        let chartData = this.orderChartData();
        let c = new Chart(this, configuration, chartData, groups, this.container, this.title, this.chartAttribution, addLockButton, restrictValues, defaultFilters);
        this.bubbleEvents(c, [
            'profile.chart.saveAsPng', 'profile.chart.valueTypeChanged',
            'profile.chart.download_csv', 'profile.chart.download_excel', 'profile.chart.download_json', 'profile.chart.download_kml',
            'point_tray.subindicator_filter.filter', 'profile.chart.filtered', 'filterRow.created.new', 'filterRow.filter.unlocked', 'filterRow.filter.locked'
        ]);

        this._chart = c;
    }

    orderChartData() {
        let primaryGroup = this.indicator.metadata.primary_group;
        let groupsOrder = this.indicator.metadata.groups.find((g) => {
            return g.name === primaryGroup
        });
        let subindicators = groupsOrder.subindicators;
        let data = this.indicator.data;

        // Sort data by subindicators
        data.sort(function (obj1, obj2) {
            return subindicators.indexOf(obj1[primaryGroup]) - subindicators.indexOf(obj2[primaryGroup]);
        })
        this.indicator.data = data;

        return this.indicator;
    }
}

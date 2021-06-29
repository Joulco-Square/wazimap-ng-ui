import {FilterRow} from "./filter_row";
import {Component, Observable} from "../../utils";
import {AddFilterButton} from "../mapchip/add_filter_button";
import {DataFilterModel} from "../../models/data_filter_model";

const filterRowClass = '.map-options__filter-row';

class FilterControllerModel extends Observable {
    static EVENTS = {
        filterRemoved: 'FilterControllerModel.filterRemoved',
        dataFilterModelUpdated: 'FilterControllerModel.dataFilterModelUpdated'
    }

    constructor(dataModelFilter = null) {
        super()
        this._filterRows = [];
        this._dataFilterModel = dataModelFilter;
    }

    get filterRows() {
        return this._filterRows;
    }

    addFilterRow(filterRow) {
        this._filterRows.push(filterRow);
    }

    get dataFilterModel() {
        return this._dataFilterModel;
    }

    removeFilterRow(filterRow) {
        this._filterRows = this._filterRows.filter(filter => filter != filterRow)
        this.triggerEvent(FilterControllerModel.EVENTS.filterRemoved, filterRow)
    }

    reset() {
        this._filterRows.forEach(filterRow => {
            this.triggerEvent(FilterControllerModel.EVENTS.filterRemoved, filterRow)
        })

        this._filterRows = []
    }

    set dataFilterModel(dataFilterModel) {
        this.reset();

        this._dataFilterModel = dataFilterModel;
        this.triggerEvent(FilterControllerModel.EVENTS.dataFilterModelUpdated, this);
    }
}

export class FilterController extends Component {

    static EVENTS = {
        ready: 'FilterController.ready'
    }

    /*
    Note to self

    About to figure out how to filter the data appropriately and send it via signal for the choropleth to be created
    After that, evaluate how easy it is to adapt this to the charts

    Things that don't currently work:
    1. Disabling the add filter button isn't working great - it checks the number of available filters, not the number of filterRowson the screen
    2. Removing filterRows is a little messsy
    */

    constructor(container) {
        super();

        this._container = container;
        this._model = new FilterControllerModel();
        this._addFilterButton = new AddFilterButton(this); // TODO should pass in a container
        this._dataFilterModel = null;
        this._filterCallback = null;

        this.prepareDomElements();
        this.prepareEvents();
    }

    get container() {
        return this._container;
    }

    get model() {
        return this._model;
    }

    get addFilterButton() {
        return this._addFilterButton;
    }

    get filterCallback() {
        return this._filterCallback;
    }

    set filterCallback(filterCallback) {
        this._filterCallback = filterCallback;
    }

    prepareDomElements() {
        this._rowContainer = $(this.container).find(filterRowClass)[0];
        $(this._rowContainer).hide();
        // $(this.container).find(filterRowClass).hide();
    }

    prepareEvents() {
        const self = this;
        this.addFilterButton.on(AddFilterButton.EVENTS.clicked, () => {
            self.addEmptyFilter()
        })
    }

    addInitialFilterRow(dataFilterModel) {
        // let rowContainer = $(this.container).find(filterRowClass)[0]
        // $(rowContainer).show();

        let isDefault = true;
        let isExtra = false;

        // this.model.filterRows.push(new FilterRow(rowContainer, dataFilterModel, isDefault, isExtra))
        this.addEmptyFilter(isDefault, isExtra);
    }

    addEmptyFilter(isDefault = false, isExtra = true) {
        if (this.model.dataFilterModel.availableFilters.length > 0) {
            const self = this;

            let filterRowContainer = this._rowContainer.cloneNode(true);
            $(filterRowContainer).show();

            let filterRow = new FilterRow(filterRowContainer, this.model.dataFilterModel, isDefault, isExtra);
            this.model.addFilterRow(filterRow);

            $(filterRow.container).insertBefore($('a.mapping-options__add-filter')); // TODO can I change this to addButton or something
            filterRow.on(FilterRow.EVENTS.removed, filterRow => {
                self.removeFilter(filterRow);
            })

            this.setAddFilterButton()

            return filterRow;
        }

        this.setAddFilterButton();

    }

    addNonAggregatableFilter(group) {
        let isDefault = true;
        let isExtra = false;
        let index = 0;

        let filterRow = this.addEmptyFilter(isDefault, isExtra);
        filterRow.indicatorDropdown.disable();

        filterRow.setPrimaryIndexUsingValue(group.name);
        filterRow.setSecondaryIndex(index);
    }

    addDefaultFilter(group) {
        let isDefault = true;
        let isExtra = false;

        let filterRow = this.addEmptyFilter(isDefault, isExtra);
        filterRow.indicatorDropdown.disable();

        filterRow.setPrimaryIndexUsingValue(group.group);
        filterRow.setSecondaryIndexUsingValue(group.value);
    }

    setAddFilterButton() { // TODO write an unselected filters getter in the data model
        if (this.model.dataFilterModel.availableFilters.length > 0)
            this.addFilterButton.enable();
        else
            this.addFilterButton.disable();
    }

    addFilter(filterName, isDefault = false, isExtra = true) {
        const self = this;

        let dataFilter = this._dataFilterModel[filterName];

        if (dataFilter != undefined) {
            let filterRowContainer = $(filterRowClass)[0].cloneNode(true);
            let filterRow = new FilterRow(filterRowContainer, dataFilter, isDefault, isExtra);
            this.filterRows.push(filterRow);
            this._dataFilterModel.addFilter(filterName);

            filterRow.on(FilterRow.EVENTS.removed, filterRow => {
                self.removeFilter(filterRow);
            })

            $(filterRow.container).insertBefore($('a.mapping-options__add-filter')); // TODO can I change this to addButton or something

            return filterRow

        } else {
            throw `Could not find filter: ${filterName}`;
        }
    }

    removeFilter(filterRow) {
        this.model.removeFilterRow(filterRow);
        this.setAddFilterButton()
    }

    clearExtraFilters() {
        const self = this;
        this.model.filterRows.forEach(filterRow => {
            // if (filterRow.isExtra)
            // self.model.removeFilterRow(filterRow);
            filterRow.removeRow();
        })
    }

    reset() {
        this.clearExtraFilters();
        this._dataFilterModel = null;
    }

    setDataFilterModel(dataFilterModel) {
        this.reset();
        this.model.dataFilterModel = dataFilterModel;

        this.model.dataFilterModel.on(DataFilterModel.EVENTS.updated, () => {
            if (this.filterCallback !== null) {
                this.filterCallback(this.model.dataFilterModel.filteredData, this.model.dataFilterModel.selectedSubIndicators);
            }
        })

        this.checkAndAddNonAggregatableGroups();
        this.checkAndAddDefaultFilterGroups();
        //this.checkAndAddPreviouslySelectedFilters();
        this.addInitialFilterRow(dataFilterModel);
    }

    checkAndAddNonAggregatableGroups() {
        const self = this;
        let nonAggregatableGroups = this.model.dataFilterModel.nonAggregatableGroups;

        nonAggregatableGroups.forEach(group => {
            if (group.name != this.model.dataFilterModel.primaryGroup) {
                self.addNonAggregatableFilter(group);
            }
        })
    }

    checkAndAddDefaultFilterGroups() {
        const self = this;
        let defaultGroups = this.model.dataFilterModel.defaultFilterGroups;

        defaultGroups.forEach(group => {
            if (group.group != this.model.dataFilterModel.primaryGroup) {
                self.addDefaultFilter(group);
            }
        })
    }

    checkAndAddPreviouslySelectedFilters() {
        const self = this;
        let previouslySelectedFilters = this.model.dataFilterModel.previouslySelectedFilters;
    }
}
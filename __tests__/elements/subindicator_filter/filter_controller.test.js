import html from '../../../src/index.html';
import {Component} from "../../../src/js/utils";
import {MapChip} from "../../../src/js/elements/mapchip/mapchip";

const mapchip_colors = {"colors": []};
let params;

describe('Filter controller', () => {
    beforeEach(() => {
        document.body.innerHTML = html;

        params = {
            chartConfiguration: {},
            childData: {
                EC: [
                    {
                        age: "15-19",
                        race: "Black African",
                        count: "3599.3753699998",
                        gender: "Female",
                        language: "Afrikaans"
                    },
                    {
                        age: "15-19",
                        race: "Black African",
                        count: "8665.81757999899",
                        gender: "Female",
                        language: "English"
                    },
                    {
                        age: "15-19",
                        race: "Black African",
                        count: "689.044740000004",
                        gender: "Female",
                        language: "isiNdebele"
                    },
                    {
                        age: "15-19",
                        race: "Black African",
                        count: "288126.247378975",
                        gender: "Female",
                        language: "isiXhosa"
                    }
                ],
                FS: [
                    {
                        age: "15-19",
                        race: "Black African",
                        count: "3379.2461000001",
                        gender: "Female",
                        language: "Afrikaans"
                    },
                    {
                        age: "15-19",
                        race: "Black African",
                        count: "2877.36439000009",
                        gender: "Female",
                        language: "English"
                    },
                    {
                        age: "15-19",
                        race: "Black African",
                        count: "528.385890000003",
                        gender: "Female",
                        language: "isiNdebele"
                    },
                    {
                        age: "15-19",
                        race: "Black African",
                        count: "10071.9081699982",
                        gender: "Female",
                        language: "isiXhosa"
                    }
                ]
            },
            description: '',
            groups: [
                {
                    subindicators: ["30-35", "20-24", "15-24 (Intl)", "15-35 (ZA)", "15-19", "25-29"],
                    dataset: 241,
                    name: "age",
                    can_aggregate: true,
                    can_filter: true
                },
                {
                    subindicators: ["Female", "Male"],
                    dataset: 241,
                    name: "gender",
                    can_aggregate: true,
                    can_filter: true
                },
                {
                    subindicators: ["Xitsonga", "Sign language", "isiNdebele", "Setswana", "Sesotho", "English", "Other", "Siswati", "Afrikaans", "Sepedi", "Tshivenda", "isiXhosa", "isiZulu"],
                    dataset: 241,
                    name: "language",
                    can_aggregate: true,
                    can_filter: true
                },
                {
                    subindicators: ["Black African", "Indian or Asian", "Other", "Coloured", "White"],
                    dataset: 241,
                    name: "race",
                    can_aggregate: true,
                    can_filter: true
                }],
            indicatorTitle: "Population by age group",
            primaryGroup: 'age',
            selectedSubindicator: '30-35'
        };
    })

    test('Handles default filter dropdown correctly', () => {
        params.chartConfiguration.filter = {
            defaults: [
                {name: "gender", value: "Female"}
            ]
        }
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);
        let indicator = params.chartConfiguration.filter.defaults[0].name;
        let subindicator = params.chartConfiguration.filter.defaults[0].value;

        let indicatorDd = $(`.map-options__filters_content .map-options__filter-row .dropdown-menu__selected-item .truncate:contains("${indicator}")`);
        let subindicatorDd = $(`.map-options__filters_content .map-options__filter-row .dropdown-menu__selected-item .truncate:contains("${subindicator}")`);

        expect(mc._filterController.model.filterRows[0].indicatorDropdown._selectedItem.text()).toBe(indicator);
        expect(indicatorDd.length).toBe(1);

        expect(mc._filterController.model.filterRows[0].subIndicatorDropdown._selectedItem.text()).toBe(subindicator);
        expect(subindicatorDd.length).toBe(1);
    })

    test('Handles non-aggregatable dropdown correctly', () => {
        params.groups[2].can_aggregate = false;
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);
        let indicator = params.groups[2].name;
        let subindicator = params.groups[2].subindicators[0];

        let indicatorDd = $(`.map-options__filters_content .map-options__filter-row .dropdown-menu__selected-item .truncate:contains("${indicator}")`);
        let subindicatorDd = $(`.map-options__filters_content .map-options__filter-row .dropdown-menu__selected-item .truncate:contains("${subindicator}")`);

        expect(mc._filterController.model.filterRows[0].indicatorDropdown._selectedItem.text()).toBe(indicator);
        expect(indicatorDd.length).toBe(1);

        expect(mc._filterController.model.filterRows[0].subIndicatorDropdown._selectedItem.text()).toBe(subindicator);
        expect(subindicatorDd.length).toBe(1);
    })

    test(('Does not create duplicate filter rows'), () => {
        params.groups[2].can_aggregate = false; //language
        params.chartConfiguration.filter = {
            defaults: [
                {name: "language", value: "English"}
            ]
        }
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);

        let indicatorDd = $(`.map-options__filters_content .map-options__filter-row .dropdown-menu__selected-item .truncate:contains("language")`);
        expect(indicatorDd.length).toBe(1);
    })

    test(('Does not create a filter row for the primary group'), () => {
        //primary group is age
        params.chartConfiguration.filter = {
            defaults: [
                {name: "age", value: "30-35"}
            ]
        }
        let component = new Component();
        let mc = new MapChip(component, mapchip_colors);

        mc.onSubIndicatorChange(params);

        let indicatorDd = $(`.map-options__filters_content .map-options__filter-row .dropdown-menu__selected-item .truncate:contains("age")`);
        expect(indicatorDd.length).toBe(0);
    })
})
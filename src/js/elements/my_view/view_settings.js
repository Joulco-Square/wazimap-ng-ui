import React, {useEffect, useState} from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {IndicatorOptionsSvg, TrashBinSvg, LockButtonSvg} from "./svg_icons";
import {
    Container,
    FilteredIndicatorBox,
    FilteredIndicatorCard, HelpText,
    IconContainer,
    RemoveButton,
    StyledAccordion,
    StyledAccordionDetails,
    StyledAccordionSummary,
    StyledTypography, StyledTypographyWithBottomBorder,
    ViewSettingsTitle
} from "./styled_elements"
import {Grid} from "@mui/material";

const ViewSettings = (props) => {
    const [expanded, setExpanded] = useState('');
    const [filteredIndicators, setFilteredIndicators] = useState([]);
    const indicatorOptionsSvg = IndicatorOptionsSvg;
    const trashBinSvg = TrashBinSvg;
    const lockButtonSvg = LockButtonSvg;

    useEffect(() => {
        if (props.filteredIndicators !== filteredIndicators) {
            setFilteredIndicators(props.filteredIndicators);
        }
    }, [props.filteredIndicators]);

    const handleExpandedChange = (panel) => {
        setExpanded(panel);
    };

    const renderFilteredIndicators = () => {
        return (
            props.filteredIndicators.map((fi) => {
                return fi.filters.map((sf, index) => {
                    if (!sf.isDefault) {
                        return (
                            <Grid item xs={12} key={fi.indicatorId + '_' + index}>
                                <FilteredIndicatorCard
                                    data-test-id={'filtered-indicator-card'}
                                >
                                    <Grid container>
                                        <Grid item xs={10}>
                                            <Grid item xs={12}>
                                                <FilteredIndicatorBox
                                                    title={`${fi.indicatorTitle} (${sf.appliesTo})`}
                                                >
                                                    {`${fi.indicatorTitle}(${sf.appliesTo[0]})`}
                                                </FilteredIndicatorBox>
                                            </Grid>
                                            <Grid container sx={{marginTop: '8px'}}>
                                                <Grid item xs={6} sx={{paddingRight: '3px'}}>
                                                    <FilteredIndicatorBox>
                                                        {sf.group}
                                                    </FilteredIndicatorBox>
                                                </Grid>
                                                <Grid item xs={6} sx={{paddingLeft: '3px'}}>
                                                    <FilteredIndicatorBox>
                                                        {sf.value}
                                                    </FilteredIndicatorBox>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <RemoveButton
                                                onClick={() => props.removeFilter(fi, sf)}
                                                data-test-id={'filtered-indicator-remove-button'}
                                            >
                                                {trashBinSvg}
                                            </RemoveButton>
                                        </Grid>
                                    </Grid>
                                </FilteredIndicatorCard>
                            </Grid>
                        )
                    }
                })
            })
        )
    }

    const renderSiteWideIndicators = () => {
        return (
            props.siteWideFilters.map((swf, index) => {
                return (
                    <Grid item xs={12} key={index}>
                        <FilteredIndicatorCard
                        >
                            <Grid container>
                                <Grid item xs={10}>
                                    <Grid container>
                                        <Grid item xs={6} sx={{paddingRight: '3px'}}>
                                            <FilteredIndicatorBox>
                                                {swf.indicatorValue}
                                            </FilteredIndicatorBox>
                                        </Grid>
                                        <Grid item xs={6} sx={{paddingLeft: '3px'}}>
                                            <FilteredIndicatorBox>
                                                {swf.subIndicatorValue}
                                            </FilteredIndicatorBox>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={2}>
                                    <RemoveButton
                                        onClick={() => props.removeSiteWideFilter(swf)}
                                    >
                                        {trashBinSvg}
                                    </RemoveButton>
                                </Grid>
                            </Grid>
                        </FilteredIndicatorCard>
                    </Grid>
                )
            })
        )
    }

    return (
        <Container>
            <ViewSettingsTitle>
                View settings
            </ViewSettingsTitle>
            <StyledAccordion
                expanded={expanded === 'indicatorOptions'}
                onChange={() => handleExpandedChange(expanded === 'indicatorOptions' ? '' : 'indicatorOptions')}
            >
                <StyledAccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={'indicatorOptions-content'}
                    id={'indicatorOptions-header'}
                >
                    <IconContainer>
                        {indicatorOptionsSvg}
                    </IconContainer>
                    <StyledTypography>INDICATOR OPTIONS</StyledTypography>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                    <StyledTypographyWithBottomBorder>
                        SITE-WIDE INDICATOR FILTERS
                    </StyledTypographyWithBottomBorder>
                    {renderSiteWideIndicators()}
                    <HelpText>
                        Toggle a site-wide filter by clicking the {lockButtonSvg} next to any indicator.
                    </HelpText>
                    <StyledTypographyWithBottomBorder>
                        INDICATOR SPECIFIC OPTIONS
                    </StyledTypographyWithBottomBorder>
                    {renderFilteredIndicators()}
                    <HelpText>
                        Any indicators you adjust will appear here
                    </HelpText>
                </StyledAccordionDetails>
            </StyledAccordion>
        </Container>
    );
}

export default ViewSettings;
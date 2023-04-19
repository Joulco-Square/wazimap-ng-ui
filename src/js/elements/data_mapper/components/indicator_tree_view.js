import React, {useState, useCallback, useMemo, useEffect} from "react";

import {
  StyledCategoryTreeItem,
  StyledSubCategoryTreeItem,
  StyledSubindicatorTreeItem,
  StyledIndicatorTreeItem
} from "./styledElements";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {isEmpty} from "lodash";


const LoadingItemView = (props) => {
  return (
    <StyledSubindicatorTreeItem nodeId={"loading"} label={
      <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
        <Typography variant="body2" sx={{ fontSize: '1em', letterSpacing: '.3px', color: '#666'}}>
          Loading...
        </Typography>
      </Box>
    }/>
  )
}

const SubindicatorItemView = (props) => {

  const onClickSubindicator = useCallback(
    () => {
      props.controller.onSubIndicatorClick({
          indicatorTitle: props.indicator.label,
          selectedSubindicator: props.subindicator,
          parents: props.parents,
          choropleth_method: props.indicator.choropleth_method,
          indicatorId: props.indicator.id,
          indicatorData: props.indicator.indicatorData,
          versionData: props.indicator.version_data,
          metadata: {
            ...props.indicator.metadata,
            indicatorDescription: props.indicator.description,
          },
          config: {
              choroplethRange: props.indicator.choropleth_range,
              enableLinearScrubber: props.indicator.enable_linear_scrubber,
              chartConfiguration: props.indicator.chartConfiguration
          }
      })
    }, [
      props.controller,
      props.indicator,
      props.subindicator
    ]
  )

  return (
    <StyledSubindicatorTreeItem
      nodeId={`datamapper-subindicator-${props.indicator.id}-${props.subindicator}`}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
          <Typography variant="body2" sx={{ fontSize: '1em', letterSpacing: '.3px', color: '#666'}} className={"truncate"}>
            {props.subindicator}
          </Typography>
        </Box>
      }
      onClick={(e) => onClickSubindicator()}
      data-test-id={`datamapper-subindicator-${props.indicator.id}-${props.subindicator}`}
      className={"subIndicator-item"}
    />
  )
}

const IndicatorItemView = (props) => {

  const [counter, setCounter] = useState(0)
  useEffect(
    () => {
      if (!props.indicator.isHidden && props.indicator.indicatorData === undefined){
        props.api.getIndicatorChildData(
          props.controller.state.profileId,
          props.controller.state.profile.profile.geography.code,
          props.indicator.id
        ).then((childData) => {
          props.indicator.indicatorData = childData;
          setCounter(counter+1);
        }).catch((response) => {
          props.indicator.indicatorData = {};
          setCounter(counter+1);
          throw(response);
        })
      }
    }
  );

  const subindicators = useMemo(
    () => {
      const indicator = props.indicator;
      const primaryGroup = indicator.metadata.primary_group;
      const primaryGroupObj = indicator.metadata.groups.filter(
        group => group.name === primaryGroup
      )

      if (primaryGroupObj.length > 0){
        return primaryGroupObj[0].subindicators.filter(
          sub => sub !== undefined && sub
        );
      }
      return [];
    }, [
      props.indicator
    ]
  );

  return (
    <StyledIndicatorTreeItem nodeId={`datamapper-indicator-${props.indicator.id}`} label={
      <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
        <Typography variant="body2" sx={{ fontSize: '1em', letterSpacing: '.3px', color: '#666'}} className="indicator-item">
          {props.indicator.label}
        </Typography>
      </Box>
    } data-test-id={`datamapper-indicator-${props.indicator.id}`}>
    {isEmpty(props.indicator.indicatorData || {}) && <LoadingItemView/>}
    {!isEmpty(props.indicator.indicatorData || {}) && subindicators.length > 0 && subindicators.map(
      (subindicator, key) => {
        return (
          <SubindicatorItemView
            subindicator={subindicator}
            key={key}
            controller={props.controller}
            indicator={props.indicator}
            parents={{
              ...props.parents,
              indicator: props.indicator.label
            }}
          />
        )
      })
    }
    </StyledIndicatorTreeItem>
  )
}

const IndicatorSubCategoryTreeView = (props) => {

  return (
    <StyledSubCategoryTreeItem nodeId={`datamapper-subcategory-${props.subcategory.id}`} label={
      <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
        <Typography variant="body2" sx={{ fontSize: '1em', fontWeight: '500', letterSpacing: '.3px' }} className="indicator-subcategory">
          {props.subcategory.name}
        </Typography>
      </Box>
    } data-test-id={`datamapper-subcategory-${props.subcategory.id}`}>
    {!props.subcategory.length > 0 && props.subcategory.indicators.map(
      (indicator, key) => {

        if (!indicator.isHidden){
          return (
            <IndicatorItemView
              indicator={indicator}
              key={key}
              api={props.api}
              controller={props.controller}
              categoryName={props.categoryName}
              SubCategoryName={props.subcategory.name}
              parents={{
                ...props.parents,
                subcategory: props.subcategory.name
              }}
            />
          )
        }
      })
    }
    </StyledSubCategoryTreeItem>

  )
}

const IndicatorCategoryTreeView = (props) => {
  return (
    <StyledCategoryTreeItem nodeId={`datamapper-category-${props.category.id}`} label={
      <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
        <Typography variant="body2" sx={{ fontSize: '.9em', fontWeight: '500', letterSpacing: '.3px' }}>
          {props.category.name}
        </Typography>
      </Box>
    } data-test-id={`datamapper-category-${props.category.id}`} className={"indicator-category"}>
    {!props.category.isHidden && props.category.subcategories.map(
      (subcategory, key) => {
        if (!subcategory.isHidden){
          return (
            <IndicatorSubCategoryTreeView
              subcategory={subcategory}
              key={key}
              api={props.api}
              controller={props.controller}
              parents={{category: props.category.name}}
            />
          )
        }
      })
    }
    </StyledCategoryTreeItem>

  )
}

export default IndicatorCategoryTreeView;

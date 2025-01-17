Feature: Popup

  Scenario: Verify the tooltip is working correctly
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    And I expand Data Mapper
    Then Data Mapper should be displayed

    # choropleth method sub-indicator
    And I click on "Demographics" in Data Mapper
    And I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper
    And I click on "15-19" in Data Mapper
    Then I confirm that the tooltip is created with the correct text and the correct values if the choropleth method is sub-indicator

    # choropleth method sibling
    And I move the cursor
    And I click on "Migration" in Data Mapper
    And I click on "Region of birth" in Data Mapper
    And I click on "Male" in Data Mapper
    Then I confirm that the tooltip is created with the correct text and the correct values if the choropleth method is sibling

    # choropleth method absolute
    And I move the cursor
    And I click on "South African Citizenship" in Data Mapper
    And I click on "Citizenship" in Data Mapper
    And I click on "Yes" in Data Mapper
    Then I confirm that the tooltip is created with the correct text and the label is hidden if the choropleth method is absolute
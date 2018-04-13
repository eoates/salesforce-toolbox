/**************************************************************************************************
 * SLDSPopoverFixForVF.css
 **************************************************************************************************
 * This file includes several CSS classes and styles from the Salesforce Lightning Design System
 * (SLDS) needed for popovers and tooltips which do not get loaded automatically for Visualforce
 * pages when rendered in Classic. This file contains only CSS for popovers and tooltips and was
 * taken directly from the SLDS with no modifications.
 *
 * The styles in this file are loaded automatically when a Visualforce is rendered in Lightning
 * Experience so your Visualforce page should check the current theme via the $User.UITheme and
 * $User.UIThemeDisplayed global variables and load this CSS only in Classic (i.e., "Theme3").
 *
 * For more information on the $User.UITheme and $User.UIThemeDisplayed variables check here
 * https://developer.salesforce.com/docs/atlas.en-us.pages.meta/pages/pages_variables_global_useruitheme.htm
 *
 * Hopefully at some point in the future Salesforce will address this issue and include the
 * relevant styles automatically. If/when that happens this file will no longer be needed and
 * should be deleted. Until that time then this file will need to be updated with each new release
 * of the SLDS. Failure to keep this file updated could result in broken or odd behavior of
 * popovers and tooltips
 *
 * @author   Eugene Oates
 * @date     2018-04-13
 * @version  1.0.0
 *
 **************************************************************************************************/

/**
 * A dialog popover, `.slds-popover`, can be applied to all variants of a dialog
 * popover. It initiates the styles of the popover and enables `.slds-nubbin` to be applied.
 *
 * A dialog popover requires at least one focusable element.
 *
 * @name base
 * @selector .slds-popover
 * @restrict [role="dialog"], [role="tooltip"]
 * @variant
 */
.slds-popover {
  position: relative;
  border-radius: 0.25rem;
  width: 20rem;
  min-height: 2rem;
  z-index: 6000;
  background-color: white;
  display: inline-block;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.16);
  border: 1px solid #dddbda;
  /**
   * @summary Applies syles for primary content area of popover
   * @selector .slds-popover__body
   * @restrict .slds-popover div
   */
  /**
   * @summary Applies styles for top area of popover
   * @selector .slds-popover__header
   * @restrict .slds-popover header, .slds-popover div
   */
  /**
   * @summary Applies styles for footer area of popover
   * @selector .slds-popover__footer
   * @restrict .slds-popover footer
   */
  /**
   * @summary Close button within a popover
   * @selector .slds-popover__close
   * @restrict .slds-popover button
   */
  /**
   * @summary Width modifier for popover - small
   * @selector .slds-popover_small
   * @restrict .slds-popover
   * @modifier
   * @group width
   */
  /**
   * @summary Width modifier for popover - medium
   * @selector .slds-popover_medium
   * @restrict .slds-popover
   * @modifier
   * @group width
   */
  /**
   * @summary Width modifier for popover - large
   * @selector .slds-popover_large
   * @restrict .slds-popover
   * @modifier
   * @group width
   */ }

.slds-popover__body, .slds-popover__header, .slds-popover__footer {
  position: relative;
  padding: 0.5rem 0.75rem; }

.slds-popover__header {
  border-bottom: 1px solid #dddbda; }

.slds-popover__footer {
  border-top: 1px solid #dddbda; }

.slds-popover__close {
  position: relative;
  margin: 0.25rem;
  z-index: 6001; }

.slds-popover_small, .slds-popover--small {
  min-width: 15rem; }

.slds-popover_medium, .slds-popover--medium {
  min-width: 20rem; }

.slds-popover_large, .slds-popover--large {
  min-width: 25rem;
  max-width: 512px; }

.slds-popover[class*="theme_"], .slds-popover[class*="theme--"] {
  border: 0; }

.slds-popover *:last-child {
  margin-bottom: 0; }

/**
 * @name panels
 * @selector .slds-popover_panel
 * @restrict .slds-popover
 * @variant
 */
.slds-popover_panel .slds-popover__header,
.slds-popover--panel .slds-popover__header {
  background: #f3f2f2;
  padding: 1.5rem 1.5rem 0.75rem;
  border-top-left-radius: calc(0.25rem - 1px);
  border-top-right-radius: calc(0.25rem - 1px);
  border-bottom: 0; }

.slds-popover_panel .slds-popover__body,
.slds-popover--panel .slds-popover__body {
  padding: 0; }

.slds-popover_panel .slds-popover__body-list,
.slds-popover--panel .slds-popover__body-list {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dddbda; }

.slds-popover_panel.slds-nubbin_left-top:before, .slds-popover_panel.slds-nubbin_left-top:after, .slds-popover_panel.slds-nubbin--left-top:before, .slds-popover_panel.slds-nubbin--left-top:after, .slds-popover_panel.slds-nubbin_right-top:before, .slds-popover_panel.slds-nubbin_right-top:after, .slds-popover_panel.slds-nubbin--right-top:before, .slds-popover_panel.slds-nubbin--right-top:after, .slds-popover_panel.slds-nubbin_top-left:before, .slds-popover_panel.slds-nubbin_top-left:after, .slds-popover_panel.slds-nubbin--top-left:before, .slds-popover_panel.slds-nubbin--top-left:after, .slds-popover_panel.slds-nubbin_top-right:before, .slds-popover_panel.slds-nubbin_top-right:after, .slds-popover_panel.slds-nubbin--top-right:before, .slds-popover_panel.slds-nubbin--top-right:after,
.slds-popover--panel.slds-nubbin_left-top:before,
.slds-popover--panel.slds-nubbin_left-top:after,
.slds-popover--panel.slds-nubbin--left-top:before,
.slds-popover--panel.slds-nubbin--left-top:after,
.slds-popover--panel.slds-nubbin_right-top:before,
.slds-popover--panel.slds-nubbin_right-top:after,
.slds-popover--panel.slds-nubbin--right-top:before,
.slds-popover--panel.slds-nubbin--right-top:after,
.slds-popover--panel.slds-nubbin_top-left:before,
.slds-popover--panel.slds-nubbin_top-left:after,
.slds-popover--panel.slds-nubbin--top-left:before,
.slds-popover--panel.slds-nubbin--top-left:after,
.slds-popover--panel.slds-nubbin_top-right:before,
.slds-popover--panel.slds-nubbin_top-right:after,
.slds-popover--panel.slds-nubbin--top-right:before,
.slds-popover--panel.slds-nubbin--top-right:after {
  background: #f3f2f2; }

.slds-popover_panel.slds-nubbin_left-top:before, .slds-popover_panel.slds-nubbin_left-top:after, .slds-popover_panel.slds-nubbin--left-top:before, .slds-popover_panel.slds-nubbin--left-top:after, .slds-popover_panel.slds-nubbin_right-top:before, .slds-popover_panel.slds-nubbin_right-top:after, .slds-popover_panel.slds-nubbin--right-top:before, .slds-popover_panel.slds-nubbin--right-top:after,
.slds-popover--panel.slds-nubbin_left-top:before,
.slds-popover--panel.slds-nubbin_left-top:after,
.slds-popover--panel.slds-nubbin--left-top:before,
.slds-popover--panel.slds-nubbin--left-top:after,
.slds-popover--panel.slds-nubbin_right-top:before,
.slds-popover--panel.slds-nubbin_right-top:after,
.slds-popover--panel.slds-nubbin--right-top:before,
.slds-popover--panel.slds-nubbin--right-top:after {
  top: 2.25rem; }

/**
   * @selector .slds-nubbin_top
   * @restrict .slds-popover, .slds-dropdown
   * @modifier
   * @group nubbins
   */
.slds-nubbin_top:before,
.slds-nubbin--top:before {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  left: 50%;
  top: -0.5rem;
  margin-left: -0.5rem; }

.slds-nubbin_top:after,
.slds-nubbin--top:after {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  left: 50%;
  top: -0.5rem;
  margin-left: -0.5rem; }

.slds-nubbin_top:after,
.slds-nubbin--top:after {
  box-shadow: -1px -1px 0 0 rgba(0, 0, 0, 0.16);
  z-index: -1; }

/**
   * @selector .slds-nubbin_top-left
   * @restrict .slds-popover, .slds-dropdown
   * @modifier
   * @group nubbins
   */
.slds-nubbin_top-left:before,
.slds-nubbin--top-left:before {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  left: 50%;
  top: -0.5rem;
  margin-left: -0.5rem; }

.slds-nubbin_top-left:after,
.slds-nubbin--top-left:after {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  left: 50%;
  top: -0.5rem;
  margin-left: -0.5rem; }

.slds-nubbin_top-left:after,
.slds-nubbin--top-left:after {
  box-shadow: -1px -1px 0 0 rgba(0, 0, 0, 0.16);
  z-index: -1; }

.slds-nubbin_top-left:before, .slds-nubbin_top-left:after,
.slds-nubbin--top-left:before,
.slds-nubbin--top-left:after {
  left: 1.5rem;
  top: -0.5rem; }

/**
   * @selector .slds-nubbin_top-right
   * @restrict .slds-popover, .slds-dropdown
   * @modifier
   * @group nubbins
   */
.slds-nubbin_top-right:before,
.slds-nubbin--top-right:before {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  left: 50%;
  top: -0.5rem;
  margin-left: -0.5rem; }

.slds-nubbin_top-right:after,
.slds-nubbin--top-right:after {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  left: 50%;
  top: -0.5rem;
  margin-left: -0.5rem; }

.slds-nubbin_top-right:after,
.slds-nubbin--top-right:after {
  box-shadow: -1px -1px 0 0 rgba(0, 0, 0, 0.16);
  z-index: -1; }

.slds-nubbin_top-right:before, .slds-nubbin_top-right:after,
.slds-nubbin--top-right:before,
.slds-nubbin--top-right:after {
  left: auto;
  right: 1.5rem;
  top: -0.5rem;
  margin-right: -0.5rem; }

/**
   * @selector .slds-nubbin_bottom
   * @restrict .slds-popover, .slds-dropdown
   * @modifier
   * @group nubbins
   */
.slds-nubbin_bottom:before,
.slds-nubbin--bottom:before {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  left: 50%;
  bottom: -0.5rem;
  margin-left: -0.5rem; }

.slds-nubbin_bottom:after,
.slds-nubbin--bottom:after {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  left: 50%;
  bottom: -0.5rem;
  margin-left: -0.5rem; }

.slds-nubbin_bottom:after,
.slds-nubbin--bottom:after {
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.16);
  z-index: -1; }

/**
   * @selector .slds-nubbin_bottom-left
   * @restrict .slds-popover, .slds-dropdown
   * @modifier
   * @group nubbins
   */
.slds-nubbin_bottom-left:before,
.slds-nubbin--bottom-left:before {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  left: 50%;
  bottom: -0.5rem;
  margin-left: -0.5rem; }

.slds-nubbin_bottom-left:after,
.slds-nubbin--bottom-left:after {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  left: 50%;
  bottom: -0.5rem;
  margin-left: -0.5rem; }

.slds-nubbin_bottom-left:after,
.slds-nubbin--bottom-left:after {
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.16);
  z-index: -1; }

.slds-nubbin_bottom-left:before, .slds-nubbin_bottom-left:after,
.slds-nubbin--bottom-left:before,
.slds-nubbin--bottom-left:after {
  left: 1.5rem;
  top: 100%;
  margin-top: -0.5rem; }

/**
   * @selector .slds-nubbin_bottom-right
   * @restrict .slds-popover, .slds-dropdown
   * @modifier
   * @group nubbins
   */
.slds-nubbin_bottom-right:before,
.slds-nubbin--bottom-right:before {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  left: 50%;
  bottom: -0.5rem;
  margin-left: -0.5rem; }

.slds-nubbin_bottom-right:after,
.slds-nubbin--bottom-right:after {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  left: 50%;
  bottom: -0.5rem;
  margin-left: -0.5rem; }

.slds-nubbin_bottom-right:after,
.slds-nubbin--bottom-right:after {
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.16);
  z-index: -1; }

.slds-nubbin_bottom-right:before, .slds-nubbin_bottom-right:after,
.slds-nubbin--bottom-right:before,
.slds-nubbin--bottom-right:after {
  left: auto;
  right: 1.5rem;
  top: 100%;
  margin-top: -0.5rem;
  margin-right: -0.5rem; }

/**
   * @selector .slds-nubbin_left
   * @restrict .slds-popover, .slds-dropdown
   * @modifier
   * @group nubbins
   */
.slds-nubbin_left:before,
.slds-nubbin--left:before {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  top: 50%;
  left: -0.5rem;
  margin-top: -0.5rem; }

.slds-nubbin_left:after,
.slds-nubbin--left:after {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  top: 50%;
  left: -0.5rem;
  margin-top: -0.5rem; }

.slds-nubbin_left:after,
.slds-nubbin--left:after {
  box-shadow: -1px 1px 2px 0 rgba(0, 0, 0, 0.16);
  z-index: -1; }

/**
   * @selector .slds-nubbin_left-top
   * @restrict .slds-popover, .slds-dropdown
   * @modifier
   * @group nubbins
   */
.slds-nubbin_left-top:before,
.slds-nubbin--left-top:before {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  top: 50%;
  left: -0.5rem;
  margin-top: -0.5rem; }

.slds-nubbin_left-top:after,
.slds-nubbin--left-top:after {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  top: 50%;
  left: -0.5rem;
  margin-top: -0.5rem; }

.slds-nubbin_left-top:after,
.slds-nubbin--left-top:after {
  box-shadow: -1px 1px 2px 0 rgba(0, 0, 0, 0.16);
  z-index: -1; }

.slds-nubbin_left-top:before, .slds-nubbin_left-top:after,
.slds-nubbin--left-top:before,
.slds-nubbin--left-top:after {
  top: 1.5rem; }

/**
   * @selector .slds-nubbin_left-bottom
   * @restrict .slds-popover, .slds-dropdown
   * @modifier
   * @group nubbins
   */
.slds-nubbin_left-bottom:before,
.slds-nubbin--left-bottom:before {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  top: 50%;
  left: -0.5rem;
  margin-top: -0.5rem; }

.slds-nubbin_left-bottom:after,
.slds-nubbin--left-bottom:after {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  top: 50%;
  left: -0.5rem;
  margin-top: -0.5rem; }

.slds-nubbin_left-bottom:before,
.slds-nubbin--left-bottom:before {
  margin-bottom: -1px; }

.slds-nubbin_left-bottom:after,
.slds-nubbin--left-bottom:after {
  box-shadow: -1px 2px 3px 0 rgba(0, 0, 0, 0.16);
  z-index: -1; }

.slds-nubbin_left-bottom:before, .slds-nubbin_left-bottom:after,
.slds-nubbin--left-bottom:before,
.slds-nubbin--left-bottom:after {
  top: auto;
  bottom: 1rem; }

/**
   * @selector .slds-nubbin_right
   * @restrict .slds-popover, .slds-dropdown
   * @modifier
   * @group nubbins
   */
.slds-nubbin_right:before,
.slds-nubbin--right:before {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  top: 50%;
  right: -0.5rem;
  margin-top: -0.5rem; }

.slds-nubbin_right:after,
.slds-nubbin--right:after {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  top: 50%;
  right: -0.5rem;
  margin-top: -0.5rem; }

.slds-nubbin_right:after,
.slds-nubbin--right:after {
  box-shadow: 1px -1px 2px 0 rgba(0, 0, 0, 0.16);
  z-index: -1; }

/**
   * @selector .slds-nubbin_right-top
   * @restrict .slds-popover, .slds-dropdown
   * @modifier
   * @group nubbins
   */
.slds-nubbin_right-top:before,
.slds-nubbin--right-top:before {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  top: 50%;
  right: -0.5rem;
  margin-top: -0.5rem; }

.slds-nubbin_right-top:after,
.slds-nubbin--right-top:after {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  top: 50%;
  right: -0.5rem;
  margin-top: -0.5rem; }

.slds-nubbin_right-top:after,
.slds-nubbin--right-top:after {
  box-shadow: 1px -1px 2px 0 rgba(0, 0, 0, 0.16);
  z-index: -1; }

.slds-nubbin_right-top:before, .slds-nubbin_right-top:after,
.slds-nubbin--right-top:before,
.slds-nubbin--right-top:after {
  top: 1.5rem; }

/**
   * @selector .slds-nubbin_right-bottom
   * @restrict .slds-popover, .slds-dropdown
   * @modifier
   * @group nubbins
   */
.slds-nubbin_right-bottom:before,
.slds-nubbin--right-bottom:before {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  top: 50%;
  right: -0.5rem;
  margin-top: -0.5rem; }

.slds-nubbin_right-bottom:after,
.slds-nubbin--right-bottom:after {
  width: 1rem;
  height: 1rem;
  position: absolute;
  transform: rotate(45deg);
  content: '';
  background-color: inherit;
  top: 50%;
  right: -0.5rem;
  margin-top: -0.5rem; }

.slds-nubbin_right-bottom:before,
.slds-nubbin--right-bottom:before {
  margin-bottom: -1px; }

.slds-nubbin_right-bottom:after,
.slds-nubbin--right-bottom:after {
  box-shadow: 2px -1px 3px 0 rgba(0, 0, 0, 0.16);
  z-index: -1; }

.slds-nubbin_right-bottom:before, .slds-nubbin_right-bottom:after,
.slds-nubbin--right-bottom:before,
.slds-nubbin--right-bottom:after {
  top: auto;
  bottom: 1rem; }

/**
 * Walkthrough components are used to provide an interactive and educational prospect experience for setup.
 *
 * @summary Initializes a walkthrough non-modal dialog
 *
 * @name walkthrough
 * @selector .slds-popover_walkthrough
 * @restrict .slds-popover
 * @variant
 */
.slds-popover_walkthrough,
.slds-popover--walkthrough {
  border-color: #061c3f;
  color: white;
  background: #032e61;
  border-color: #032e61; }

.slds-popover_walkthrough .slds-text-title,
.slds-popover_walkthrough .slds-text-title_caps,
.slds-popover_walkthrough .slds-text-title--caps,
.slds-popover--walkthrough .slds-text-title,
.slds-popover--walkthrough .slds-text-title_caps,
.slds-popover--walkthrough .slds-text-title--caps {
  color: #b0adab; }

.slds-popover_walkthrough .slds-icon,
.slds-popover--walkthrough .slds-icon {
  fill: currentColor; }

.slds-popover_walkthrough a,
.slds-popover--walkthrough a {
  color: currentColor; }

.slds-popover_walkthrough a:hover, .slds-popover_walkthrough a:focus,
.slds-popover--walkthrough a:hover,
.slds-popover--walkthrough a:focus {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  outline: 0; }

.slds-popover_walkthrough a:active,
.slds-popover--walkthrough a:active {
  color: rgba(255, 255, 255, 0.5); }

.slds-popover_walkthrough a[disabled],
.slds-popover--walkthrough a[disabled] {
  color: rgba(255, 255, 255, 0.15); }

.slds-popover_walkthrough a,
.slds-popover--walkthrough a {
  text-decoration: underline; }

.slds-popover_walkthrough .slds-popover__header,
.slds-popover--walkthrough .slds-popover__header {
  background-color: #164a85;
  background-image: url("/assets/images/popovers/popover-header.png");
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: contain;
  border-color: inherit;
  padding: 0.75rem 1rem;
  text-shadow: 0 0 4px #032e61; }

.slds-popover_walkthrough .slds-popover__body,
.slds-popover_walkthrough .slds-popover__footer,
.slds-popover--walkthrough .slds-popover__body,
.slds-popover--walkthrough .slds-popover__footer {
  padding: 1rem; }

.slds-popover_walkthrough .slds-popover__footer,
.slds-popover--walkthrough .slds-popover__footer {
  border: 0; }

.slds-popover_walkthrough .slds-popover__close,
.slds-popover--walkthrough .slds-popover__close {
  margin-top: 0.5rem;
  margin-right: 0.5rem; }

.slds-popover_walkthrough .slds-text-title,
.slds-popover--walkthrough .slds-text-title {
  color: #d9dbdd; }

.slds-popover_walkthrough.slds-nubbin_top:before, .slds-popover_walkthrough.slds-nubbin--top:before, .slds-popover_walkthrough.slds-nubbin_top-left:before, .slds-popover_walkthrough.slds-nubbin--top-left:before, .slds-popover_walkthrough.slds-nubbin_top-right:before, .slds-popover_walkthrough.slds-nubbin--top-right:before, .slds-popover_walkthrough.slds-nubbin_left-top:before, .slds-popover_walkthrough.slds-nubbin--left-top:before, .slds-popover_walkthrough.slds-nubbin_right-top:before, .slds-popover_walkthrough.slds-nubbin--right-top:before,
.slds-popover--walkthrough.slds-nubbin_top:before,
.slds-popover--walkthrough.slds-nubbin--top:before,
.slds-popover--walkthrough.slds-nubbin_top-left:before,
.slds-popover--walkthrough.slds-nubbin--top-left:before,
.slds-popover--walkthrough.slds-nubbin_top-right:before,
.slds-popover--walkthrough.slds-nubbin--top-right:before,
.slds-popover--walkthrough.slds-nubbin_left-top:before,
.slds-popover--walkthrough.slds-nubbin--left-top:before,
.slds-popover--walkthrough.slds-nubbin_right-top:before,
.slds-popover--walkthrough.slds-nubbin--right-top:before {
  background-color: #164a85; }

/**
 * Alternate background for walkthrough non-modal dialog
 *
 * @selector .slds-popover_walkthrough-alt
 * @restrict .slds-popover_walkthrough
 * @modifier
 */
.slds-popover_walkthrough-alt,
.slds-popover_feature {
  border-color: #164a85;
  background-color: #164a85;
  background-image: url("/assets/images/popovers/popover-action.png");
  background-repeat: no-repeat;
  background-size: 100% 2.25rem;
  background-position: bottom;
  padding-bottom: 1.5rem;
  color: white; }

.slds-popover_walkthrough-alt .slds-text-heading_small,
.slds-popover_feature .slds-text-heading_small {
  margin-bottom: 0.5rem; }

.slds-popover_walkthrough-alt.slds-nubbin_bottom:before, .slds-popover_walkthrough-alt.slds-nubbin--bottom:before, .slds-popover_walkthrough-alt.slds-nubbin_bottom-left:before, .slds-popover_walkthrough-alt.slds-nubbin--bottom-left:before, .slds-popover_walkthrough-alt.slds-nubbin_bottom-right:before, .slds-popover_walkthrough-alt.slds-nubbin--bottom-right:before,
.slds-popover_feature.slds-nubbin_bottom:before,
.slds-popover_feature.slds-nubbin--bottom:before,
.slds-popover_feature.slds-nubbin_bottom-left:before,
.slds-popover_feature.slds-nubbin--bottom-left:before,
.slds-popover_feature.slds-nubbin_bottom-right:before,
.slds-popover_feature.slds-nubbin--bottom-right:before {
  background-color: #215ca0; }

/**
 * Einstein components are used to provide an interactive experience with Einstein features
 *
 * @summary Initializes a Einstein non-modal dialog
 *
 * @name einstein
 * @selector .slds-popover_einstein
 * @restrict .slds-popover
 * @variant
 */
/**
 * The tooltip should be positioned with JavaScript.
 *
 * You can include inline help tooltips for form elements and any focusable items, such as anchor links, buttons, etc. If your tooltips are available on hover, also make sure that they’re available on keyboard focus. To allow screen readers to access the tooltip, the HTML form field element must  have an `aria-describedby` attribute that points to the tooltip `ID` of the tooltip.
 *
 * @summary Initializes a tooltip
 *
 * @variant
 * @name base
 * @selector .slds-popover_tooltip
 * @restrict [role="tooltip"]
 * @support dev-ready
 */
.slds-popover_tooltip,
.slds-popover--tooltip {
  width: auto;
  max-width: 20rem;
  background: #16325c;
  border: 0; }

.slds-popover_tooltip .slds-popover__body,
.slds-popover--tooltip .slds-popover__body {
  font-size: 0.75rem;
  color: white; }

/**
 * @selector .slds-rise-from-ground
 * @restrict .slds-popover_tooltip
 * @modifier
 * @group toggle
 */
.slds-rise-from-ground {
  visibility: visible;
  opacity: 1;
  transform: translate(0%, 0%);
  transition: opacity 0.1s linear, visibility 0.1s linear, transform 0.1s linear;
  will-change: transform; }

/**
 * @selector .slds-fall-into-ground
 * @restrict .slds-popover_tooltip
 * @modifier
 * @group toggle
 */
.slds-fall-into-ground {
  visibility: hidden;
  opacity: 0;
  transform: translate(0%, 0%);
  transition: opacity 0.1s linear, visibility 0.1s linear, transform 0.1s linear;
  will-change: transform; }

.slds-slide-from-bottom-to-top {
  transform: translateY(10%);
  will-change: transform; }

.slds-slide-from-top-to-bottom {
  transform: translateY(-10%);
  will-change: transform; }

.slds-slide-from-right-to-left {
  transform: translateX(5%);
  will-change: transform; }

.slds-slide-from-left-to-right {
  transform: translateX(-5%);
  will-change: transform; }

.slds-tooltip {
  position: relative;
  border-radius: 0.25rem;
  width: 20rem;
  min-height: 2rem;
  z-index: 6000;
  background-color: #061c3f;
  display: inline-block; }

.slds-tooltip__body {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  color: white; }
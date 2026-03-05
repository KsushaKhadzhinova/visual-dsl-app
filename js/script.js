const buttonElementToOpenAiAssistantSideDrawer = document.getElementById("ai-assistant-trigger");
const buttonElementToCloseAiAssistantSideDrawer = document.getElementById("ai-assistant-close-button-action");
const containerElementForAiAssistantSideDrawer = document.getElementById("ai-assistant-side-drawer-panel");

const buttonElementToOpenExportSettingsModalWindow = document.getElementById("export-dialog-trigger");
const buttonElementToCloseExportSettingsModalWindow = document.getElementById("export-dialog-close-button-action");
const containerElementForExportSettingsModalWindow = document.getElementById("export-options-modal-window-container");

const buttonElementToChangeDiagramNotationType = document.getElementById("notation-selector-trigger");
const textElementDisplayingActiveNotationValue = document.querySelector(".dropdown-active-value-text-dynamic");

const buttonElementToExecuteDiagramRenderingProcess = document.querySelector(".toolbar-action-button-to-execute-rendering");
const containerElementForDiagramVisualizationOutput = document.querySelector(".diagram-canvas-svg-rendering-wrapper");
const textareaElementForUserDiagramSourceCode = document.querySelector(".editor-source-code-text-input-field");

function changeVisibilityStatusOfUserInterfaceElement(userInterfaceElement, makeVisible) {
  if (makeVisible) {
    userInterfaceElement.classList.remove("hidden-interface-element");
    userInterfaceElement.style.display = "flex";
  } else {
    userInterfaceElement.classList.add("hidden-interface-element");
    userInterfaceElement.style.display = "none";
  }
}

function executeVisualRenderingSimulationForDiagram() {
  containerElementForDiagramVisualizationOutput.style.transition = "opacity 0.3s ease-in-out";
  containerElementForDiagramVisualizationOutput.style.opacity = "0.2";

  setTimeout(function restoreDiagramAppearanceAfterSimulatedDelay() {
    containerElementForDiagramVisualizationOutput.style.opacity = "1";
    console.log("Интерфейс: Визуализация успешно обновлена для кода: " + textareaElementForUserDiagramSourceCode.value);
  }, 450);
}

function handleUserActionOpenAiAssistant() {
  changeVisibilityStatusOfUserInterfaceElement(containerElementForAiAssistantSideDrawer, true);
}

function handleUserActionCloseAiAssistant() {
  changeVisibilityStatusOfUserInterfaceElement(containerElementForAiAssistantSideDrawer, false);
}

function handleUserActionOpenExportSettings() {
  changeVisibilityStatusOfUserInterfaceElement(containerElementForExportSettingsModalWindow, true);
}

function handleUserActionCloseExportSettings() {
  changeVisibilityStatusOfUserInterfaceElement(containerElementForExportSettingsModalWindow, false);
}

function handleUserActionSwitchDiagramNotation() {
  const currentNotationNameValue = textElementDisplayingActiveNotationValue.textContent;
  
  if (currentNotationNameValue === "Mermaid") {
    textElementDisplayingActiveNotationValue.textContent = "PlantUML";
  } else if (currentNotationNameValue === "PlantUML") {
    textElementDisplayingActiveNotationValue.textContent = "D2";
  } else {
    textElementDisplayingActiveNotationValue.textContent = "Mermaid";
  }
}

function handleMouseClickEventsOutsideOfModalWindows(mouseClickEventInformation) {
  const userClickedDirectlyOnExportModalOverlay = mouseClickEventInformation.target === containerElementForExportSettingsModalWindow;

  if (userClickedDirectlyOnExportModalOverlay) {
    handleUserActionCloseExportSettings();
  }
}

function initializeAllApplicationInterfaceInteractions() {
  if (buttonElementToOpenAiAssistantSideDrawer) {
    buttonElementToOpenAiAssistantSideDrawer.addEventListener("click", handleUserActionOpenAiAssistant);
  }

  if (buttonElementToCloseAiAssistantSideDrawer) {
    buttonElementToCloseAiAssistantSideDrawer.addEventListener("click", handleUserActionCloseAiAssistant);
  }

  if (buttonElementToOpenExportSettingsModalWindow) {
    buttonElementToOpenExportSettingsModalWindow.addEventListener("click", handleUserActionOpenExportSettings);
  }

  if (buttonElementToCloseExportSettingsModalWindow) {
    buttonElementToCloseExportSettingsModalWindow.addEventListener("click", handleUserActionCloseExportSettings);
  }

  if (buttonElementToChangeDiagramNotationType) {
    buttonElementToChangeDiagramNotationType.addEventListener("click", handleUserActionSwitchDiagramNotation);
  }

  if (buttonElementToExecuteDiagramRenderingProcess) {
    buttonElementToExecuteDiagramRenderingProcess.addEventListener("click", executeVisualRenderingSimulationForDiagram);
  }

  window.addEventListener("click", handleMouseClickEventsOutsideOfModalWindows);
}

document.addEventListener("DOMContentLoaded", initializeAllApplicationInterfaceInteractions);
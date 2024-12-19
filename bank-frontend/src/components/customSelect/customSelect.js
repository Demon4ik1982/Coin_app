import arrow from "../../asset/images/arrow.svg";
import check from "../../asset/images/check.svg";
import { el } from "redom";

export class CustomSelect {
  constructor(label, options, type = "input" | "select", position) {
    this.label = label;
    this.options = options;
    this.type = type;
    this.position = position;
    this.checkImg = el("img", { src: check }, { class: "select__check" });
    this.selectOptions = this.options.map((item) => {
      return el("div", { class: "select__option" }, item);
    });
    this._selectValue = "";
    this._numberValue = 0;
  }

  get selectValue() {
    return this._selectValue;
  }

  get plaseholderValue() {
    return this._numberValue;
  }

  set plaseholderValue(text) {
    return (this._numberValue = text);
  }

  onClick() {
    return this.selectOptions;
  }

  createCustom() {

    const selectItems = el(
      "div",
      {
        class:
          this.position === "bottom"
            ? "select__items select__hide select__bottom"
            : "select__items select__hide",
      },
      this.selectOptions
    );

    const arrowImg = el(
      "div",
      { class: "select__arrow" },
      el("img", { src: arrow })
    );

    let selectedText = el("span", this.label);

    if (this.type === "input") {
      selectedText = el(
        "input",
        {
          class: "select__input",
          placeholder: this.label
        },
      );
      selectedText.addEventListener('input', () => {
        this._selectValue = selectedText.value
        console.log(selectedText.value);
        console.log(this._selectValue);
      })
    }

    const selectSelected = el("div", { class: "select__selected" }, [
      selectedText,
      arrowImg,
    ]);

    const customSelect = el("div", { class: "select__custom-select" }, [
      selectSelected,
      selectItems,
    ]);

    if (this.type === "input") {
      arrowImg.addEventListener("click", function () {
        selectItems.classList.toggle("select__hide");
        arrowImg.classList.toggle("rotate");
      });
    }

    if (this.type === "select") {
      selectSelected.addEventListener("click", function () {
        selectItems.classList.toggle("select__hide");
        arrowImg.classList.toggle("rotate");
      });
    }

    this.selectOptions.forEach((option) => {
      option.addEventListener("click", () => {
        selectedText.textContent = option.textContent;

        this._selectValue = option.textContent;

        if (this.type === "input") {
          selectedText.placeholder = '';
          selectedText.value = option.textContent;

        }

        this.selectOptions.forEach((opt) => {
          opt.classList.remove("selected");
        });

        option.append(this.checkImg);
        option.classList.add("selected");

        selectItems.classList.add("select__hide");
        arrowImg.classList.toggle("rotate");
      });
    });

    document.addEventListener("click", function (e) {
      if (
        !customSelect.contains(e.target) &&
        !selectItems.classList.contains("select__hide")
      ) {
        selectItems.classList.add("select__hide");
        arrowImg.classList.toggle("rotate");
      }
    });

    return customSelect;
  }
}

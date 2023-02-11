const { readCarName, readTryCount } = require("./UI/InputView");
const {
  printResultMessage,
  printCarMovement,
  printWinner,
} = require("./UI/OutputView");
const { COMMA } = require("./Utils/Constants");
const Utils = require("./Utils/Utils");
const {
  inputCarNameValidator,
  tryCountValidator,
} = require("./Validator/Validator");
const { errorCatcher } = require("./Validator/ErrorCatcher");

class App {
  #games;
  #round;

  constructor(game) {
    this.#games = game;
    this.#round = 0;
  }

  play() {
    readCarName(this.inputCarNameCallback);
  }

  splitCarNames = (names) => {
    return names.split(COMMA).map((name) => name.trim());
  };

  inputCarNameCallback = (names) => {
    const cars = this.splitCarNames(names);

    const isValidated = errorCatcher(
      () => inputCarNameValidator(cars),
      () => readCarName(this.inputCarNameCallback)
    );
    if (isValidated) return;

    this.#games.initializeCarStatus(cars);
    readTryCount(this.readTryCountCallback);
  };

  readTryCountCallback = (count) => {
    const isValidated = errorCatcher(
      () => tryCountValidator(count),
      () => readTryCount(this.readTryCountCallback)
    );
    if (isValidated) return;

    this.#round = count;
    this.showGameResult();
  };

  showGameResult = () => {
    printResultMessage();
    this.showGameRound();
    printWinner(this.#games.findWinner(this.#games.getCarStatus()));
    Utils.close();
  };

  showGameRound = () => {
    for (let idx = 0; idx < this.#round; idx++) {
      const currentCarStatus = this.#games.cycleCarStatus(
        this.#games.getCarStatus()
      );

      printCarMovement(currentCarStatus);
    }
  };
}

module.exports = App;

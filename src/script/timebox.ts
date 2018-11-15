abstract class Timer {
    private static endTime: Date;
    private static remainingTime: number = 0;
    private static running: boolean = false;
    private static intervalId: number;

    public static startTimer(callback): void {
        if (Timer.remainingTime > 0) {
            Timer.endTime = new Date(Date.now() + Timer.remainingTime);
            Timer.running = true;
        }
        this.intervalId = setInterval(() => {
            Timer.calculateRemainingTime();
            callback();
        }, 10);
    }

    public static stopTimer(callback): void {
        clearInterval(Timer.intervalId);
        Timer.running = false;
        callback();
    }

    public static setRemainingTime(hours: number, minutes?: number, seconds?: number, milliseconds?: number): void {
        let time: number = 0;

        time += hours * 60 * 60 * 1000;
        time += (minutes ? minutes : 0) * 60 * 1000;
        time += (seconds ? seconds : 0) * 1000;
        time += (milliseconds ? milliseconds : 0);

        Timer.remainingTime = time;
    }

    public static getRemainingTime(): number {
        return Timer.running ? Timer.endTime.getMilliseconds() - Date.now() : Timer.remainingTime;
    }

    private static calculateRemainingTime(): void {
        if (Timer.running) {
            Timer.remainingTime = Timer.endTime.getMilliseconds() - Date.now();
        }
    }
}

function displayRemainingTime(): void {
    const hoursSpan: JQuery = $('#hour');
    const minutesSpan: JQuery = $('#minute');
    const secondsSpan: JQuery = $('#second');
    const millisecondsSpan: JQuery = $('#millisecond');
    let remainingTime: number = Timer.getRemainingTime();
    let hours: number = 0;
    const hoursFactor = 60 * 60 * 1000;
    let minutes: number = 0;
    const minutesFactor = 60 * 1000;
    let seconds: number = 0;
    const secondsFactor = 1000;

    if (remainingTime < 0) {
        remainingTime = 0;
        // TODO: When the timer is over, show the elapsed time (negative value) since the end of the timer
        // remainingTime = Math.abs(remainingTime);
    }

    if (remainingTime >= hoursFactor) {
        hours = Math.floor(remainingTime / hoursFactor);
        remainingTime = remainingTime - (hours * hoursFactor);
    }
    if (remainingTime >= minutesFactor) {
        minutes = Math.floor(remainingTime / minutesFactor);
        remainingTime = remainingTime - (minutes * minutesFactor);
    }
    if (remainingTime >= secondsFactor) {
        seconds = Math.floor(remainingTime / secondsFactor);
        remainingTime = remainingTime - (seconds * secondsFactor);
    }

    hoursSpan.text(hours < 10 ? '0' + hours : hours);
    minutesSpan.text(minutes < 10 ? '0' + minutes : minutes);
    secondsSpan.text(seconds < 10 ? '0' + seconds : seconds);
    millisecondsSpan.text(remainingTime < 100 ?
        (remainingTime < 10 ? '00' + remainingTime : '0' + remainingTime) :
        remainingTime);
}

function setupTimer(): void {
    event.preventDefault();

    const hourInput: JQuery = $('#hoursInput');
    const minuteInput: JQuery = $('#minutesInput');
    const secondInput: JQuery = $('#secondsInput');

    Timer.setRemainingTime(Number(hourInput.val()), Number(minuteInput.val()), Number(secondInput.val()), 0);
    displayRemainingTime();
}

function startTimer(): void {
    event.preventDefault();

    Timer.startTimer(displayRemainingTime());
}

function stopTimer(): void {
    event.preventDefault();

    Timer.stopTimer(displayRemainingTime());
}

$(() => {
    const setupTimerForm: JQuery = $('#setupTimerForm');
    const startTimerButton: JQuery = $('#startTimerButton');
    const stopTimerButton: JQuery = $('#stopTimerButton');

    Timer.setRemainingTime(0, 0, 0, 0);
    displayRemainingTime();

    setupTimerForm.on('submit', setupTimer);
    startTimerButton.on('click', startTimer);
    stopTimerButton.on('click', stopTimer);
});

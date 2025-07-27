document.addEventListener('DOMContentLoaded', () => {
    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');
    const digitalClock = document.getElementById('digital-clock');

    function updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        digitalClock.textContent = formattedTime;

        const hourDegrees = (hours % 12) * 30 + (minutes * 0.5);
        const minuteDegrees = minutes * 6 + (seconds * 0.1);
        const secondDegrees = seconds * 6;

        hourHand.style.transform = `rotate(${hourDegrees}deg)`;
        minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
        secondHand.style.transform = `rotate(${secondDegrees}deg)`;
    }
    setInterval(updateClock, 1000);
    updateClock();
});
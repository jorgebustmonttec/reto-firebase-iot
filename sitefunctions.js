const slider = document.getElementById("sliderTemperatura");
const sliderValue = document.querySelector(".slider-value");

slider.addEventListener("input", function() {
  sliderValue.innerHTML = this.value+" grados celsius";
});

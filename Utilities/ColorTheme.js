let currentTheme;

onload = () => {
  currentTheme = window.localStorage.getItem("theme");
  if(!currentTheme || currentTheme === "dark"){ 
    currentTheme = "light";

  }
};

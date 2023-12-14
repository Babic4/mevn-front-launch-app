<template>
  <div class="center">
    <div class="e-404">ОШИБКА.404.</div>
  </div>
</template>
<script>
export default {};
</script>
<style>
.center {
  display: flex;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
}

.e-404 {
  font-size: 3em;
  font-weight: 700;
  color: #0000c5;
}

/* -------------------------  adaptive  -------------------------- */
/*==========  Desktop First  ========== */
/* Large Devices, Wide Screens */
@media only screen and (max-width: 1200px) {
  /* */
}
/* Medium Devices, Desktops */
@media only screen and (max-width: 992px) {
  /* */
}
/* Small Devices, Tablets */
@media only screen and (max-width: 768px) {
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  .input {
    padding: 0 12px;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>

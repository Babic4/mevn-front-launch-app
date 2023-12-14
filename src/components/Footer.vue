<template>
  <footer>
    <div class="footer-bottom">
      <div class="copyright">
        Launch, PBC <i class="fas fa-circle"></i> Бабич Д. А. © 2021
      </div>
      <div class="messangers">
        <a href=""><i class="fab fa-vk"></i></a>
        <a href=""><i class="fab fa-telegram-plane"></i></a>
        <a href=""><i class="fab fa-twitter"></i></a>
        <a href=""><i class="fab fa-facebook-f"></i></a>
        <a href=""><i class="fab fa-discord"></i></a>
      </div>
    </div>
  </footer>
</template>
<script>
export default {};
</script>
<style scoped>
.fa-circle {
  font-size: 0.3em;
  padding: 0 6px;
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
  /* */
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  footer {
    padding: 0 12px;
  }

  .footer-bottom {
    font-size: 0.7em;
    padding: 8px 0;
  }

  .messangers > a {
    font-size: 1em;
    margin-left: 12px;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>

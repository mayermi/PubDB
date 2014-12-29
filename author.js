$(function() {
  $( "#accordion" ).accordion({
    heightStyle: "content";
  });
});

<script>
  $(document).foundation({
    accordion: {
      callback : function (accordion) {
        console.log(accordion);
      }
    }
  });
</script>
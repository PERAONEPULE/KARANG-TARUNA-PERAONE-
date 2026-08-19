// ==========================================
// KARANG TARUNA PERAONEPULE
// JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

  // ============================
  // MENU MOBILE
  // ============================

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");

      if (navMenu.classList.contains("active")) {
        menuToggle.textContent = "✕";
      } else {
        menuToggle.textContent = "☰";
      }
    });

    // Tutup menu setelah memilih menu
    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        menuToggle.textContent = "☰";
      });
    });
  }

  // ============================
  // TAHUN OTOMATIS
  // ============================

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // ============================
  // TOMBOL BACK TO TOP
  // ============================

  const backTop = document.getElementById("backTop");

  if (backTop) {

    window.addEventListener("scroll", function () {

      if (window.scrollY > 400) {
        backTop.classList.add("show");
      } else {
        backTop.classList.remove("show");
      }

    });

    backTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // ============================
  // ANIMASI SAAT SCROLL
  // ============================

  const animatedElements = document.querySelectorAll(
    ".about-card, .activity-card, .leader-card, .gallery-item, .contact-card"
  );

  const observer = new IntersectionObserver(
    function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }

      });

    },
    {
      threshold: 0.1
    }
  );

  animatedElements.forEach(function (element) {

    element.style.opacity = "0";
    element.style.transform = "translateY(25px)";
    element.style.transition =
      "opacity 0.6s ease, transform 0.6s ease";

    observer.observe(element);

  });
  // ============================
// KONFIRMASI KAS PERAONEPULE
// Rp5.000 setiap 2 minggu
// ============================

const KAS_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbxoY4Ed2VejMYODWLr_AEgSxVR4GYtIfmjqGPCuEcH7x6j0Z_N1qsODa3yeXJOGFEy_kw/exec";

const kasSection = document.getElementById("kas");
const kasCard = kasSection
  ? kasSection.querySelector(".kas-card")
  : null;

if (kasCard) {

  // Hapus tombol WhatsApp lama
  const oldButton =
    kasCard.querySelector(".qris-wa-button");

  if (oldButton) {
    oldButton.remove();
  }

  const formBox = document.createElement("div");

  formBox.className = "kas-confirm-box";

  formBox.innerHTML = `
    <div class="kas-confirm-icon">🧾</div>

    <h3>Konfirmasi Pembayaran Kas</h3>

    <p>
      Setelah membayar melalui QRIS, isi formulir di bawah.
      Nominal kas adalah <strong>Rp5.000 setiap 2 minggu</strong>.
    </p>

    <form id="kasConfirmForm">

      <label>Nama Anggota</label>

      <input
        id="kasNama"
        name="nama"
        type="text"
        placeholder="Masukkan nama lengkap"
        required
        maxlength="80"
      >

      <label>Periode Kas</label>

      <input
        id="kasPeriode"
        name="periode"
        type="text"
        readonly
      >

      <label>Tanggal Pembayaran</label>

      <input
        id="kasTanggal"
        name="tanggal"
        type="date"
        required
      >

      <label>Nominal</label>

      <div class="kas-fixed-nominal">
        Rp5.000
      </div>

      <input
        type="hidden"
        name="nominal"
        value="5000"
      >

      <label>Bukti Pembayaran</label>

      <input
        id="kasBukti"
        type="file"
        accept="image/*"
        required
      >

      <small>
        Upload screenshot bukti pembayaran. Maksimal 2 MB.
      </small>

      <label>Keterangan</label>

      <textarea
        id="kasKeterangan"
        rows="3"
        maxlength="200"
        placeholder="Contoh: Kas periode ini"
      ></textarea>

      <button
        type="submit"
        id="kasSubmitButton"
        class="kas-submit-button"
      >
        💰 Kirim Konfirmasi Pembayaran
      </button>

      <div
        id="kasFormMessage"
        class="kas-form-message"
      ></div>

    </form>

    <iframe
      name="kasSubmitFrame"
      id="kasSubmitFrame"
      style="display:none;"
    ></iframe>
  `;

  kasCard.appendChild(formBox);

  const form =
    document.getElementById("kasConfirmForm");

  const nama =
    document.getElementById("kasNama");

  const periode =
    document.getElementById("kasPeriode");

  const tanggal =
    document.getElementById("kasTanggal");

  const bukti =
    document.getElementById("kasBukti");

  const keterangan =
    document.getElementById("kasKeterangan");

  const button =
    document.getElementById("kasSubmitButton");

  const message =
    document.getElementById("kasFormMessage");

  const iframe =
    document.getElementById("kasSubmitFrame");


  // =====================================
  // PERIODE KAS 14 HARI
  // Mulai 19 Agustus 2026
  // =====================================

  const tanggalAwal =
    new Date(2026, 7, 19);

  function duaAngka(angka) {
    return String(angka).padStart(2, "0");
  }

  function tanggalInput(date) {

    return (
      date.getFullYear() +
      "-" +
      duaAngka(date.getMonth() + 1) +
      "-" +
      duaAngka(date.getDate())
    );

  }

  function formatTanggal(date) {

    return date.toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }
    );

  }

  function updatePeriodeKas() {

    const sekarang =
      new Date();

    const hariIni =
      new Date(
        sekarang.getFullYear(),
        sekarang.getMonth(),
        sekarang.getDate()
      );

    const selisih =
      Math.floor(
        (hariIni - tanggalAwal) /
        86400000
      );

    const nomorPeriode =
      Math.max(
        0,
        Math.floor(selisih / 14)
      );

    const mulai =
      new Date(tanggalAwal);

    mulai.setDate(
      mulai.getDate() +
      nomorPeriode * 14
    );

    const selesai =
      new Date(mulai);

    selesai.setDate(
      selesai.getDate() + 13
    );

    periode.value =
      "Periode " +
      (nomorPeriode + 1) +
      " — " +
      formatTanggal(mulai) +
      " s/d " +
      formatTanggal(selesai);

  }

  tanggal.value =
    tanggalInput(new Date());

  updatePeriodeKas();


  // =====================================
  // PROSES KIRIM
  // =====================================

  let sedangMengirim = false;

  iframe.addEventListener(
    "load",
    function () {

      if (!sedangMengirim) {
        return;
      }

      sedangMengirim = false;

      button.disabled = false;

      button.textContent =
        "💰 Kirim Konfirmasi Pembayaran";

      message.className =
        "kas-form-message success";

      message.innerHTML =
        "✅ <strong>Konfirmasi berhasil dikirim.</strong><br>" +
        "Data pembayaran Rp5.000 sudah dikirim " +
        "dan menunggu verifikasi bendahara.";

      form.reset();

      tanggal.value =
        tanggalInput(new Date());

      updatePeriodeKas();

    }
  );


  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      const file =
        bukti.files[0];

      if (!file) {

        message.className =
          "kas-form-message error";

        message.textContent =
          "❌ Bukti pembayaran wajib diupload.";

        return;
      }

      if (!file.type.startsWith("image/")) {

        message.className =
          "kas-form-message error";

        message.textContent =
          "❌ Bukti harus berupa gambar.";

        return;
      }

      if (file.size > 2 * 1024 * 1024) {

        message.className =
          "kas-form-message error";

        message.textContent =
          "❌ Ukuran bukti maksimal 2 MB.";

        return;
      }


      button.disabled = true;

      button.textContent =
        "⏳ Mengirim...";

      sedangMengirim = true;


      try {

        const hasil =
          await kompresGambar(file);


        const hiddenForm =
          document.createElement("form");

        hiddenForm.method =
          "POST";

        hiddenForm.action =
          KAS_WEB_APP_URL;

        hiddenForm.target =
          "kasSubmitFrame";

        hiddenForm.style.display =
          "none";


        tambahInput(
          hiddenForm,
          "nama",
          nama.value.trim()
        );

        tambahInput(
          hiddenForm,
          "periode",
          periode.value
        );

        tambahInput(
          hiddenForm,
          "tanggal",
          tanggal.value
        );

        tambahInput(
          hiddenForm,
          "nominal",
          "5000"
        );

        tambahInput(
          hiddenForm,
          "bukti",
          hasil.data
        );

        tambahInput(
          hiddenForm,
          "namaFile",
          hasil.namaFile
        );

        tambahInput(
          hiddenForm,
          "tipeFile",
          "image/jpeg"
        );

        tambahInput(
          hiddenForm,
          "keterangan",
          keterangan.value.trim()
        );


        document.body.appendChild(
          hiddenForm
        );

        hiddenForm.submit();


        setTimeout(
          function () {

            if (sedangMengirim) {

              sedangMengirim = false;

              button.disabled = false;

              button.textContent =
                "💰 Kirim Konfirmasi Pembayaran";

              message.className =
                "kas-form-message error";

              message.textContent =
                "❌ Pengiriman belum mendapat respons. Silakan coba lagi.";

            }

            hiddenForm.remove();

          },
          20000
        );


      } catch (error) {

        sedangMengirim = false;

        button.disabled = false;

        button.textContent =
          "💰 Kirim Konfirmasi Pembayaran";

        message.className =
          "kas-form-message error";

        message.textContent =
          "❌ Bukti pembayaran gagal diproses.";

      }

    }
  );


  function tambahInput(
    form,
    nama,
    nilai
  ) {

    const input =
      document.createElement("input");

    input.type =
      "hidden";

    input.name =
      nama;

    input.value =
      nilai;

    form.appendChild(
      input
    );

  }


  function kompresGambar(file) {

    return new Promise(
      function (resolve, reject) {

        const reader =
          new FileReader();

        reader.onload =
          function (event) {

            const image =
              new Image();

            image.onload =
              function () {

                const ukuranMaksimal =
                  1400;

                let width =
                  image.width;

                let height =
                  image.height;


                if (
                  width > ukuranMaksimal ||
                  height > ukuranMaksimal
                ) {

                  const skala =
                    Math.min(
                      ukuranMaksimal / width,
                      ukuranMaksimal / height
                    );

                  width =
                    Math.round(
                      width * skala
                    );

                  height =
                    Math.round(
                      height * skala
                    );

                }


                const canvas =
                  document.createElement(
                    "canvas"
                  );

                canvas.width =
                  width;

                canvas.height =
                  height;


                const context =
                  canvas.getContext(
                    "2d"
                  );

                context.drawImage(
                  image,
                  0,
                  0,
                  width,
                  height
                );


                const dataURL =
                  canvas.toDataURL(
                    "image/jpeg",
                    0.78
                  );


                resolve({

                  data:
                    dataURL.split(",")[1],

                  namaFile:
                    "bukti-kas-" +
                    Date.now() +
                    ".jpg"

                });

              };


            image.onerror =
              reject;

            image.src =
              event.target.result;

          };


        reader.onerror =
          reject;

        reader.readAsDataURL(
          file
        );

      }
    );

  }


  // =====================================
  // STYLE FORM
  // =====================================

  const style =
    document.createElement("style");

  style.textContent = `

    .kas-confirm-box {
      margin-top: 30px;
      padding: 30px;
      border-radius: 18px;
      background: #f8f8f8;
      text-align: left;
    }

    .kas-confirm-icon {
      font-size: 40px;
      text-align: center;
      margin-bottom: 10px;
    }

    .kas-confirm-box h3 {
      text-align: center;
      margin-bottom: 10px;
    }

    .kas-confirm-info {
      text-align: center;
      line-height: 1.6;
      color: #666;
      margin-bottom: 25px;
    }

    .kas-confirm-form {
      display: flex;
      flex-direction: column;
      gap: 9px;
    }

    .kas-confirm-form label {
      font-weight: 600;
      margin-top: 8px;
    }

    .kas-confirm-form input,
    .kas-confirm-form textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 10px;
      font: inherit;
      background: white;
    }

    .kas-fixed-nominal {
      padding: 12px;
      border-radius: 10px;
      background: #fff;
      font-weight: bold;
      font-size: 18px;
    }

    .kas-confirm-form small {
      color: #777;
    }

    .kas-submit-button {
      margin-top: 15px;
      padding: 14px 18px;
      border: 0;
      border-radius: 10px;
      cursor: pointer;
      font: inherit;
      font-weight: 700;
    }

    .kas-submit-button:disabled {
      opacity: .6;
      cursor: wait;
    }

    .kas-form-message {
      margin-top: 15px;
      line-height: 1.6;
    }

    .kas-form-message.success {
      padding: 14px;
      border-radius: 10px;
      background: #e8f7ed;
    }

    .kas-form-message.error {
      padding: 14px;
      border-radius: 10px;
      background: #fdeaea;
    }

  `;

  document.head.appendChild(style);

}

});

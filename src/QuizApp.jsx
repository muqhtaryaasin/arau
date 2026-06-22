import React, { useState, useMemo, useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";

const COLORS = {
  cream: "#FBF6E9",
  sky: "#3E8FB0",
  skyDark: "#1F5A73",
  sun: "#F2A93B",
  sunDark: "#8A5A0F",
  hibiscus: "#D14B5A",
  hibiscusDark: "#7A1F28",
  leaf: "#5C8A3A",
  leafDark: "#33501F",
  ink: "#2B2B26",
};

const BANK = {
  1: {
    A: [
      { type: "kosa-kata", q: "Apakah nama haiwan ini? 🐱", opts: ["Kucing", "Anjing", "Ayam", "Itik"] },
      { type: "kosa-kata", q: "Apakah nama buah ini? 🍌", opts: ["Pisang", "Epal", "Limau", "Mangga"] },
      { type: "ejaan", q: "Pilih ejaan yang betul bagi perkataan 'skool'.", opts: ["sekolah", "sekolha", "sokolah", "sekolaah"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["rumah", "rumahh", "ruma", "rumaah"] },
      { type: "kata-nama", q: "'Kerusi' tergolong dalam kata nama...", opts: ["am", "khas", "ganti nama", "adjektif"] },
      { type: "kata-kerja", q: "Saya ___ ke sekolah setiap hari.", opts: ["pergi", "kucing", "buku", "merah"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'besar' ialah...", opts: ["kecil", "tinggi", "panjang", "berat"] },
      { type: "kosa-kata", q: "Apakah warna ini? 🔴", opts: ["Merah", "Biru", "Hijau", "Kuning"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["kerusi", "kerusii", "kerusy", "kerrusi"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'panas' ialah...", opts: ["sejuk", "terang", "gelap", "basah"] },
      { type: "kosa-kata", q: "Apakah nama haiwan ini? 🐘", opts: ["Gajah", "Zirafah", "Harimau", "Kuda"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["ayah", "ayyah", "ayaah", "aiah"] },
      { type: "kata-nama", q: "'Meja' ialah kata nama...", opts: ["am", "khas", "ganti nama", "kerja"] },
      { type: "kata-kerja", q: "Emak ___ nasi untuk makan malam.", opts: ["memasak", "buku", "tinggi", "hijau"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'malam' ialah...", opts: ["siang", "petang", "subuh", "pagi buta"] },
      { type: "kosa-kata", q: "Alat untuk menulis ialah...", opts: ["pen", "baldi", "topi", "kasut"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["buku", "bukku", "buuku", "booku"] },
      { type: "kata-nama", q: "'Kuala Lumpur' ialah contoh kata nama...", opts: ["khas", "am", "ganti nama", "adjektif"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'suka' ialah...", opts: ["benci", "marah", "sedih", "kecewa"] },
      { type: "kosa-kata", q: "Kita pakai ___ di kaki.", opts: ["kasut", "topi", "baju", "cermin mata"] },
    ],
    B: [
      { type: "kosa-kata", q: "Apakah nama anggota keluarga ini? 👵", opts: ["Nenek", "Abang", "Kakak", "Pak cik"] },
      { type: "kata-nama", q: "Nama khas bagi seorang murid lelaki ialah...", opts: ["Ali", "budak", "guru", "kawan"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["meja", "meje", "mejaa", "mejja"] },
      { type: "kata-kerja", q: "Adik ___ susu setiap pagi.", opts: ["minum", "kucing", "cantik", "dua"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'tinggi' ialah...", opts: ["rendah", "kecil", "kurus", "lemah"] },
      { type: "kosa-kata", q: "3 ekor + 2 ekor ayam, jumlahnya ialah...", opts: ["5 ekor", "4 ekor", "6 ekor", "7 ekor"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["bola", "bolla", "boula", "bolah"] },
      { type: "kata-nama", q: "'Ahmad' ialah contoh kata nama...", opts: ["khas", "am", "kerja", "adjektif"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'gemuk' ialah...", opts: ["kurus", "pendek", "kuat", "manis"] },
      { type: "kosa-kata", q: "Tempat kita tidur di rumah ialah...", opts: ["bilik tidur", "dapur", "garaj", "tandas"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["ibu", "ibbu", "ibuu", "ebbu"] },
      { type: "kosa-kata", q: "Apakah nama haiwan ini? 🐸", opts: ["Katak", "Ular", "Cicak", "Tikus"] },
      { type: "kata-kerja", q: "Ayah ___ akhbar setiap pagi.", opts: ["membaca", "meja", "tinggi", "biru"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'cerah' ialah...", opts: ["gelap", "sejuk", "panas", "hujan"] },
      { type: "kosa-kata", q: "Tempat memasak makanan di rumah ialah...", opts: ["dapur", "bilik tidur", "tandas", "bilik tamu"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["pokok", "pokkok", "pokkk", "poukk"] },
      { type: "kata-nama", q: "'Kucing' tergolong dalam kata nama...", opts: ["am", "khas", "ganti nama", "adjektif"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'keras' ialah...", opts: ["lembut", "ringan", "nipis", "licin"] },
      { type: "kosa-kata", q: "Kita guna ___ untuk membersihkan gigi.", opts: ["berus gigi", "sisir", "tuala", "sabun"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["ikan", "ikkan", "iikan", "ekan"] },
    ],
    C: [
      { type: "kbat", img: "🏠🐶", q: "Ali ada seekor anjing. Anjing itu tidur di luar rumah pada waktu malam dan menyalak apabila ada orang asing datang. Mengapakah anjing Ali menyalak apabila orang asing datang?", opts: ["Untuk memberitahu dan melindungi keluarga Ali", "Kerana anjing itu lapar", "Kerana anjing itu mahu bermain", "Kerana anjing itu sakit"] },
      { type: "kbat", img: "🌧️☂️", q: "Hari ini hujan lebat. Mei Ling hendak pergi ke sekolah. Apakah barang yang PALING penting dibawa oleh Mei Ling?", opts: ["Payung", "Bola", "Buku cerita", "Topi"] },
      { type: "kbat", img: "🍽️🧼", q: "Sebelum makan, kita perlu membasuh tangan. Mengapakah kita perlu membasuh tangan sebelum makan?", opts: ["Supaya tangan bersih dan kita tidak sakit perut", "Supaya tangan menjadi sejuk", "Supaya makanan lebih sedap", "Supaya tangan menjadi licin"] },
      { type: "kbat", img: "🐔🥚", q: "Ibu ayam mengeram telurnya selama beberapa minggu. Apakah yang akan terjadi selepas telur itu dierami?", opts: ["Telur akan menetas menjadi anak ayam", "Telur akan menjadi lebih besar", "Telur akan bertukar warna", "Telur akan hilang"] },
      { type: "kbat", img: "🚦🚸", q: "Aiman hendak menyeberang jalan ke sekolah. Lampu isyarat menunjukkan warna merah untuk pejalan kaki. Apakah yang patut Aiman lakukan?", opts: ["Berhenti dan menunggu lampu bertukar hijau", "Terus berlari menyeberang", "Bermain di tepi jalan", "Memanggil kawan"] },
      { type: "kbat", img: "🌱💧", q: "Pokok bunga dalam pasu layu kerana tidak disiram. Apakah yang perlu dilakukan supaya pokok itu segar semula?", opts: ["Siram pokok itu dengan air yang cukup", "Pindahkan pokok ke tempat gelap", "Cabut semua daun pokok itu", "Biarkan sahaja pokok itu"] },
      { type: "kbat", img: "🎒📚", q: "Alif tertinggal buku teks di rumah. Apakah cara terbaik untuk Alif teruskan belajar di kelas?", opts: ["Meminjam buku daripada kawan yang baik hati", "Tidur di dalam kelas", "Pulang ke rumah untuk ambil buku", "Berdiam diri dan tidak buat apa-apa"] },
      { type: "kbat", img: "🌞🌙", q: "Pada waktu malam, langit kelihatan gelap dan berbintang. Apakah yang menyebabkan waktu siang lebih cerah berbanding waktu malam?", opts: ["Cahaya matahari menerangi bumi pada waktu siang", "Bintang lebih terang pada waktu siang", "Langit bertukar warna pada waktu siang", "Angin bertiup lebih kencang pada waktu siang"] },
      { type: "kbat", img: "🤧😷", q: "Encik Jamal sedang bersin-bersin dan batuk. Apakah yang patut dia lakukan supaya tidak menjangkiti orang lain?", opts: ["Menutup mulut dan hidung dengan tisu semasa bersin", "Bersin ke arah orang lain", "Tidak pergi ke doktor", "Makan gula-gula"] },
      { type: "kbat", img: "🍎🍊🍇", q: "Dalam peti sejuk ada epal, oren, dan anggur. Ibu mahu membuat jus buah-buahan. Buah manakah yang PALING sesuai untuk membuat jus?", opts: ["Semua buah-buahan tersebut boleh dijadikan jus", "Hanya epal sahaja", "Hanya anggur sahaja", "Buah-buahan tidak boleh dibuat jus"] },
      { type: "kbat", img: "🐜🌿", q: "Semut berbaris panjang membawa makanan ke sarang mereka. Apakah yang boleh kita pelajari daripada tingkah laku semut ini?", opts: ["Bekerjasama dan rajin bekerja", "Suka bermain sahaja", "Sentiasa tidur", "Tidak mahu berkongsi"] },
      { type: "kbat", img: "🏫🔔", q: "Loceng sekolah sudah berbunyi tetapi Rina masih bermain di padang. Apakah yang patut Rina lakukan?", opts: ["Segera masuk ke kelas", "Teruskan bermain", "Lari pulang ke rumah", "Bersembunyi di belakang pokok"] },
      { type: "kbat", img: "💡🔦", q: "Semasa waktu malam tiba-tiba lampu padam. Apakah benda yang PALING berguna untuk digunakan pada masa itu?", opts: ["Lampu suluh/torch", "Buku", "Bola", "Kasut"] },
      { type: "kbat", img: "🌊🏖️", q: "Ayu dan adiknya pergi ke pantai. Ombak kelihatan sangat besar dan kuat. Apakah tindakan yang PALING selamat untuk mereka?", opts: ["Jangan mandi laut dan berhati-hati di tepi pantai", "Terus berenang ke tengah laut", "Berlari masuk ke dalam air", "Abaikan sahaja ombak besar itu"] },
      { type: "kbat", img: "🍰🎂", q: "Hari ini hari jadi adik Laila. Laila ingin memberi hadiah tetapi tidak mempunyai wang. Apakah tindakan terbaik Laila?", opts: ["Membuat kad ucapan atau hadiah sendiri dengan kreativiti", "Tidak buat apa-apa langsung", "Meminta wang daripada orang lain secara paksa", "Menangis sahaja"] },
      { type: "kbat", img: "🚿🧴", q: "Selepas bermain di luar, tangan Raju sangat kotor. Apakah tindakan yang betul untuk Raju membersihkan diri?", opts: ["Basuh tangan dengan sabun dan air bersih, kemudian lap dengan tuala", "Lap tangan dengan baju", "Tiup tangan sehingga bersih", "Biarkan tangan tetap kotor"] },
      { type: "kbat", img: "🐟🐠", q: "Ikan dalam akuarium kelihatan lesu dan tidak aktif. Air akuarium kelihatan keruh. Apakah punca paling mungkin ikan itu tidak sihat?", opts: ["Air akuarium kotor dan perlu ditukar", "Ikan terlalu gembira", "Akuarium terlalu besar", "Cahaya terlalu terang"] },
      { type: "kbat", img: "🥕🥦🍅", q: "Doktor berkata kita perlu makan sayur-sayuran setiap hari. Mengapakah kita digalakkan makan sayur setiap hari?", opts: ["Sayur mengandungi vitamin dan mineral yang baik untuk kesihatan badan", "Sayur menjadikan kita lebih tinggi dengan serta-merta", "Sayur membuatkan kita tidak perlu tidur", "Sayur tidak sedap tetapi wajib dimakan"] },
      { type: "kbat", img: "📮✉️", q: "Nenek tinggal jauh di kampung dan tidak tahu menggunakan telefon. Apakah cara terbaik untuk berkomunikasi dengan nenek?", opts: ["Hantar surat atau minta ibu bapa hubungi nenek", "Abaikan nenek", "Pergi sendiri ke kampung tanpa memberitahu ibu bapa", "Tunggu nenek datang sendiri"] },
      { type: "kbat", img: "🏃🚶", q: "Ketika melintas jalan, Hafiz berlari laju tanpa melihat kiri kanan. Apakah risiko tindakan Hafiz itu?", opts: ["Boleh dilanggar kenderaan dan cedera", "Boleh sampai lebih cepat ke destinasi", "Menjadi lebih cergas", "Tiada sebarang risiko"] },
    ],
  },
  2: {
    A: [
      { type: "kosa-kata", q: "Tempat membeli ubat dipanggil...", opts: ["Farmasi", "Perpustakaan", "Padang", "Dewan"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["pemandu", "pemandhu", "pemandoo", "pemanduh"] },
      { type: "kata-adjektif", q: "Kata yang menerangkan sifat dalam ayat 'Bunga itu cantik' ialah...", opts: ["cantik", "Bunga", "itu", "-"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'rajin' ialah...", opts: ["malas", "pandai", "kuat", "cergas"] },
      { type: "kosa-kata", q: "Orang yang mengajar di sekolah ialah...", opts: ["Guru", "Doktor", "Polis", "Peniaga"] },
      { type: "kata-ganti", q: "'Kami akan pergi ke pasar' — 'kami' ialah kata ganti nama...", opts: ["diri pertama", "diri kedua", "diri ketiga", "tempat"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["bersih", "berseh", "bershi", "bersieh"] },
      { type: "kosa-kata", q: "Bilangan hari dalam seminggu ialah...", opts: ["7", "5", "6", "8"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'gembira' ialah...", opts: ["sedih", "marah", "letih", "lapar"] },
      { type: "kata-kerja", q: "Pilih kata kerja berimbuhan 'ber-' yang betul.", opts: ["bermain", "memain", "dimain", "pemain"] },
      { type: "kata-adjektif", q: "Apakah kata adjektif dalam ayat 'Adik saya sangat pandai'?", opts: ["pandai", "adik", "sangat", "saya"] },
      { type: "kata-ganti", q: "'Awak' ialah kata ganti nama diri...", opts: ["kedua", "pertama", "ketiga", "tempat"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["bersama", "bersamma", "bersema", "bersamma"] },
      { type: "kata-kerja", q: "Pilih kata kerja berimbuhan 'ber-' yang betul.", opts: ["berjalan", "memjalan", "dijalan", "pejalan"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'lembut' ialah...", opts: ["keras", "kasar", "licin", "tajam"] },
      { type: "kosa-kata", q: "Alat yang digunakan untuk memotong kertas ialah...", opts: ["gunting", "pensel", "pembaris", "pemadam"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["selamat", "selamatt", "selamaat", "salamat"] },
      { type: "kata-adjektif", q: "Pilih kata adjektif yang sesuai: 'Langit pada waktu malam kelihatan sangat ___.'", opts: ["gelap", "berlari", "kerusi", "minum"] },
      { type: "kata-ganti", q: "'Mereka' ialah kata ganti nama diri...", opts: ["ketiga", "pertama", "kedua", "tempat"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'terang' ialah...", opts: ["gelap", "sejuk", "panas", "kering"] },
    ],
    B: [
      { type: "kosa-kata", q: "Tempat menyimpan buku untuk dibaca ramai ialah...", opts: ["Perpustakaan", "Kantin", "Stor", "Bilik guru"] },
      { type: "kata-adjektif", q: "'Sungai itu dalam dan jernih' — kata adjektif dalam ayat ini ialah...", opts: ["dalam dan jernih", "sungai", "itu", "dan"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["payung", "payong", "pyung", "payungg"] },
      { type: "kata-ganti", q: "'Dia sedang membaca buku' — 'dia' ialah kata ganti nama diri...", opts: ["ketiga", "pertama", "kedua", "tempat"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'kuat' ialah...", opts: ["lemah", "cepat", "tinggi", "berat"] },
      { type: "kata-kerja", q: "Ayah ___ kereta setiap hujung minggu.", opts: ["membasuh", "basuhan", "pembasuh", "basuh-basuh"] },
      { type: "kosa-kata", q: "Haiwan yang hidup di dalam air ialah...", opts: ["Ikan", "Kambing", "Ayam", "Kucing"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["telefon", "telefone", "telephon", "telifon"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'basah' ialah...", opts: ["kering", "sejuk", "lembap", "licin"] },
      { type: "kata-adjektif", q: "Pilih kata adjektif yang sesuai: 'Kek itu rasanya sangat ___.'", opts: ["manis", "lari", "meja", "membeli"] },
      { type: "kosa-kata", q: "Tempat kita pergi apabila sakit ialah...", opts: ["klinik/hospital", "kedai", "sekolah", "taman"] },
      { type: "kata-ganti", q: "'Kamu' ialah kata ganti nama diri...", opts: ["kedua", "pertama", "ketiga", "nama khas"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["membaca", "menbaca", "membacaa", "membecca"] },
      { type: "kata-adjektif", q: "Pilih kata adjektif: 'Budak itu ___ dan rajin belajar.'", opts: ["pintar", "berlari", "meja", "dapur"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'mahal' ialah...", opts: ["murah", "banyak", "sedikit", "baru"] },
      { type: "kata-kerja", q: "Pilih kata kerja berimbuhan 'ber-' yang betul.", opts: ["berniaga", "meberniaga", "diniaga", "peniaga"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["membeli", "menbeli", "memmbeli", "membely"] },
      { type: "kosa-kata", q: "Buah yang berwarna kuning dan melengkung bentuknya ialah...", opts: ["pisang", "epal", "betik", "jambu"] },
      { type: "kata-ganti", q: "Gantikan 'Ahmad dan Siti' dengan kata ganti nama yang sesuai.", opts: ["Mereka", "Dia", "Kami", "Kamu"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'bersih' ialah...", opts: ["kotor", "hodoh", "buruk", "busuk"] },
    ],
    C: [
      { type: "kbat", img: "🌳🍃", q: "Pokok di taman itu layu kerana tidak disiram selama seminggu. Apakah tindakan terbaik yang patut diambil untuk menyelamatkan pokok itu?", opts: ["Menyiram pokok itu dengan air dengan segera", "Menebang pokok itu", "Membiarkan sahaja pokok itu", "Memetik semua daunnya"] },
      { type: "kbat", img: "🧹🏫", q: "Kelas Hafiz kelihatan kotor selepas waktu rehat. Bagaimanakah Hafiz dan rakan-rakannya boleh menjaga kebersihan kelas?", opts: ["Bergotong-royong membersihkan kelas bersama-sama", "Membiarkan sahaja kelas kotor", "Menyalahkan pengawas sekolah", "Menutup pintu kelas"] },
      { type: "kbat", img: "💰🐷", q: "Siti menerima wang saku setiap hari tetapi membelanjakannya semua untuk gula-gula. Apakah cadangan terbaik untuk Siti?", opts: ["Menyimpan sebahagian wang di dalam tabung", "Terus membeli gula-gula setiap hari", "Membuang wang itu", "Memberi semua wang kepada kawan"] },
      { type: "kbat", img: "🦷😬", q: "Adik jarang menggosok gigi dan kini giginya berlubang. Apakah punca utama masalah gigi adik?", opts: ["Tidak menggosok gigi dengan kerap", "Makan terlalu banyak sayur", "Tidur terlalu awal", "Minum air kosong"] },
      { type: "kbat", img: "🐢🐇", q: "Dalam cerita arnab dan kura-kura, arnab berlari pantas tetapi berhenti berehat, manakala kura-kura berjalan perlahan tetapi tidak berhenti. Siapakah yang menang dan mengapa?", opts: ["Kura-kura, kerana tekun dan tidak berputus asa", "Arnab, kerana lebih pantas", "Kedua-duanya seri", "Tiada yang menang"] },
      { type: "kbat", img: "🌍🌿", q: "Murid-murid kelas 2 mahu menanam pokok di dalam kelas untuk menjadikan kelas lebih cantik dan nyaman. Apakah faedah utama menanam pokok di dalam kelas?", opts: ["Pokok mengeluarkan oksigen dan menjadikan udara lebih segar", "Pokok membuatkan kelas lebih sempit", "Pokok akan menarik nyamuk ke dalam kelas", "Pokok tidak memberi sebarang faedah"] },
      { type: "kbat", img: "🧃🍬", q: "Setiap hari rehat, Aqil selalu membeli minuman bergas dan gula-gula. Apakah nasihat yang paling baik untuknya?", opts: ["Kurangkan pengambilan gula dan pilih makanan yang lebih berkhasiat", "Makan lebih banyak gula-gula supaya lebih bertenaga", "Tidak perlu makan di waktu rehat", "Kongsi gula-gula dengan semua kawan"] },
      { type: "kbat", img: "🦜🌳", q: "Seekor burung kakak tua tidak boleh terbang lagi setelah kakinya cedera. Namun ia tetap cuba menggunakan paruhnya untuk bergerak. Apakah nilai yang ditunjukkan oleh burung itu?", opts: ["Tabah dan tidak berputus asa walaupun dalam kesusahan", "Malas dan tidak mahu berusaha", "Suka meminta bantuan sahaja", "Tidak berguna"] },
      { type: "kbat", img: "🌧️❄️", q: "Mimi hendak pergi ke sekolah tetapi hujan lebat turun. Ibu berkata jalan berhadapan rumah sudah banjir. Apakah tindakan terbaik untuk Mimi?", opts: ["Tunggu di rumah dan maklumkan kepada guru", "Terus pergi ke sekolah walaupun banjir", "Merentas kawasan banjir bersendirian", "Menangis dan tidak buat apa-apa"] },
      { type: "kbat", img: "🎨🖌️", q: "Cikgu meminta murid melukis gambar keluarga. Hashim tidak tahu melukis dengan baik dan berasa malu. Apakah yang patut Hashim lakukan?", opts: ["Cuba melukis dengan sebaik yang boleh tanpa berasa malu", "Menyalin lukisan kawan tanpa kebenaran", "Tidak membuat kerja tersebut", "Mengejek lukisan kawan lain"] },
      { type: "kbat", img: "🛒🧺", q: "Emak menghantar Dina ke kedai untuk membeli tiga benda: roti, susu, dan telur. Di kedai, Dina terlupa satu benda. Apakah cara terbaik untuk mengelakkan kejadian ini pada masa hadapan?", opts: ["Tulis senarai barang yang perlu dibeli sebelum pergi", "Pergi ke kedai tanpa berfikir", "Beli semua benda yang ada di kedai", "Minta kawan pergi ke kedai"] },
      { type: "kbat", img: "🐕🐾", q: "Seekor anjing jalanan kelihatan kelaparan dan lemah di tepi jalan. Apakah tindakan yang paling bertimbang rasa boleh dilakukan?", opts: ["Beri makanan dan beritahu orang dewasa atau pihak berkaitan", "Lari menjauhi anjing itu", "Halau anjing itu pergi", "Hanya memerhati tanpa berbuat apa-apa"] },
      { type: "kbat", img: "📺⏰", q: "Haziq suka menonton televisyen sehingga larut malam dan sering mengantuk di sekolah. Apakah cadangan terbaik untuk Haziq?", opts: ["Hadkan masa menonton dan tidur awal supaya segar ke sekolah", "Terus menonton hingga pagi", "Tidak perlu tidur langsung", "Minta ibu bapa matikan televisyen sahaja"] },
      { type: "kbat", img: "🌺🌻", q: "Taman bunga sekolah tidak lagi cantik kerana tidak dijaga. Apakah projek terbaik yang boleh dilakukan oleh murid-murid untuk menghidupkan semula taman tersebut?", opts: ["Bergotong-royong menyapu, menyiram, dan menanam bunga baharu", "Biarkan taman terus usang", "Tutup sahaja taman itu", "Minta kontraktor luar untuk membuat kerja"] },
      { type: "kbat", img: "🚴🏫", q: "Darwisyah tinggal dekat sekolah. Setiap hari ayahnya menghantarnya dengan kereta menyebabkan kesesakan lalu lintas di hadapan sekolah. Apakah alternatif terbaik?", opts: ["Berjalan kaki atau menunggang basikal ke sekolah", "Naik teksi ke sekolah", "Minta cikgu ambil dia di rumah", "Berhenti pergi ke sekolah"] },
      { type: "kbat", img: "🍚🍜", q: "Setiap hari Nadia hanya mahu makan mi dan tidak mahu makan nasi atau sayur. Apakah masalah yang mungkin timbul jika Nadia terus berbuat demikian?", opts: ["Badan Nadia mungkin kekurangan zat makanan dan menjadi tidak sihat", "Nadia akan menjadi lebih kuat", "Nadia akan lebih pandai di sekolah", "Tiada masalah langsung"] },
      { type: "kbat", img: "🏆🤝", q: "Pasukan badminton sekolah kalah dalam perlawanan dengan sekolah jiran. Apakah sikap terbaik yang patut ditunjukkan?", opts: ["Terima kekalahan dengan hati terbuka dan ucapkan tahniah kepada pasukan lawan", "Menangis dan mengamuk", "Menyalahkan rakan sepasukan", "Menolak berjabat tangan dengan pasukan lawan"] },
      { type: "kbat", img: "💻📱", q: "Ibu Hamid memberitahu bahawa masa menggunakan gajet perlu dihadkan kepada satu jam sehari. Hamid berasa tidak puas hati. Apakah tindakan yang paling wajar untuk Hamid?", opts: ["Berbincang dengan ibu secara sopan dan cuba faham sebabnya", "Merajuk dan tidak mahu bercakap dengan ibu", "Gunakan gajet secara diam-diam", "Lempar gajet dengan marah"] },
      { type: "kbat", img: "🌬️🌪️", q: "Ribut kuat melanda kawasan perumahan dan beberapa pokok tumbang. Apakah tindakan PERTAMA yang patut dilakukan oleh penduduk selepas ribut reda?", opts: ["Pastikan semua ahli keluarga selamat dan semak kerosakan dengan berhati-hati", "Keluar berlari ke jalan raya segera", "Pergi bermain seperti biasa", "Tidur dan abaikan kejadian ribut itu"] },
      { type: "kbat", img: "🎁🙏", q: "Tok Wan memberikan wang raya kepada Aiman. Apakah nilai murni yang patut ditunjukkan oleh Aiman?", opts: ["Mengucapkan terima kasih dengan sopan dan hormat", "Terus ambil wang tanpa berterima kasih", "Meminta lebih banyak wang", "Memberi wang itu kepada orang lain tanpa berterima kasih"] },
    ],
  },
  3: {
    A: [
      { type: "kata-hubung", q: "Saya suka membaca ___ adik saya suka melukis.", opts: ["tetapi", "kerana", "supaya", "ke"] },
      { type: "kata-sendi", q: "Buku itu terletak ___ atas meja.", opts: ["di", "ke", "dari", "pada"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["menyanyi", "menyayi", "menyanyii", "manyanyi"] },
      { type: "imbuhan", q: "Pilih kata berimbuhan 'meN-' yang betul bagi 'tulis'.", opts: ["menulis", "metulis", "menyulis", "metulisi"] },
      { type: "simpulan-bahasa", q: "'Buah tangan' bermaksud...", opts: ["hadiah", "marah", "rajin", "cepat"] },
      { type: "kosa-kata", q: "Alat untuk mengukur suhu badan ialah...", opts: ["termometer", "penggaris", "jangka sudut", "neraca"] },
      { type: "kata-sendi", q: "Mereka berjalan ___ sekolah dengan gembira.", opts: ["ke", "di", "oleh", "untuk"] },
      { type: "ayat-majmuk", q: "Pilih kata hubung gabungan yang betul: 'Dia rajin belajar ___ dia pandai bercakap.'", opts: ["dan", "tetapi", "atau", "kerana"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["istimewa", "istimewah", "istimewaa", "estimewa"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'murah' ialah...", opts: ["mahal", "banyak", "sedikit", "baru"] },
      { type: "kata-hubung", q: "Dia tidak datang ke sekolah ___ dia sakit.", opts: ["kerana", "dan", "tetapi", "atau"] },
      { type: "kata-sendi", q: "Hadiah itu dibeli ___ emak untuk adik.", opts: ["oleh", "ke", "dari", "di"] },
      { type: "imbuhan", q: "Pilih kata berimbuhan 'meN-' yang betul bagi 'lukis'.", opts: ["melukis", "memlukis", "menlukis", "dilukis"] },
      { type: "simpulan-bahasa", q: "'Berat tulang' bermaksud...", opts: ["malas bekerja", "rajin membantu", "kuat semangat", "mudah jatuh"] },
      { type: "kosa-kata", q: "Orang yang mereka bentuk bangunan dipanggil...", opts: ["arkitek", "doktor", "juruterbang", "guru"] },
      { type: "kata-hubung", q: "Ambil mana-mana satu: buku ___ pen.", opts: ["atau", "dan", "tetapi", "kerana"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["persembahan", "persembahaan", "persembaan", "persembahhan"] },
      { type: "kata-sendi", q: "Dia pulang ___ kampung untuk bercuti.", opts: ["ke", "di", "oleh", "dari"] },
      { type: "imbuhan", q: "Pilih kata berimbuhan 'meN-' yang betul bagi 'angkat'.", opts: ["mengangkat", "meangkat", "menangkat", "diangkat"] },
      { type: "simpulan-bahasa", q: "'Panjang tangan' bermaksud orang yang...", opts: ["suka mencuri", "tangan panjang", "rajin bekerja", "suka memberi"] },
    ],
    B: [
      { type: "kata-hubung", q: "Saya hendak membeli buku ___ pen di kedai itu.", opts: ["dan", "tetapi", "kerana", "jika"] },
      { type: "kata-sendi", q: "Dia baru sahaja pulang ___ sekolah.", opts: ["dari", "ke", "akan", "untuk"] },
      { type: "imbuhan", q: "Pilih kata berimbuhan 'meN-' yang betul bagi 'baca'.", opts: ["membaca", "menbaca", "membacaa", "mebaca"] },
      { type: "simpulan-bahasa", q: "'Ringan tulang' bermaksud...", opts: ["rajin bekerja/membantu", "lemah", "pemalas", "kuat makan"] },
      { type: "kosa-kata", q: "Orang yang merawat orang sakit di hospital ialah...", opts: ["doktor", "peguam", "jurutera", "arkitek"] },
      { type: "ayat-majmuk", q: "'Hari hujan ___ kami tidak dapat bermain bola.' Isi tempat kosong.", opts: ["jadi", "dan", "atau", "lalu"] },
      { type: "kata-sendi", q: "Hadiah itu diberikan ___ guru besar.", opts: ["oleh", "ke", "dari", "di"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["kawasan", "kawassan", "kawazan", "kewasan"] },
      { type: "lawan-kata", q: "Lawan kata bagi 'gelap' ialah...", opts: ["terang", "cerah", "panas", "indah"] },
      { type: "kosa-kata", q: "Bangunan tempat menyimpan wang ialah...", opts: ["bank", "pejabat pos", "balai polis", "stesen bas"] },
      { type: "kata-hubung", q: "Walaupun hujan lebat, ___ dia tetap pergi ke sekolah.", opts: ["namun", "dan", "atau", "sebab"] },
      { type: "kata-sendi", q: "Buku cerita itu dipinjam ___ perpustakaan.", opts: ["dari", "ke", "di", "untuk"] },
      { type: "imbuhan", q: "Pilih kata berimbuhan 'meN-' yang betul bagi 'masak'.", opts: ["memasak", "menmasak", "memmasak", "menyasak"] },
      { type: "simpulan-bahasa", q: "'Kepala angin' bermaksud seseorang yang...", opts: ["tidak tetap pendirian/suka bertukar fikiran", "kepala sejuk", "banyak idea", "sangat bijak"] },
      { type: "kosa-kata", q: "Kereta api berjalan di atas...", opts: ["landasan", "jalan raya", "sungai", "udara"] },
      { type: "kata-hubung", q: "Kita mesti berusaha ___ berjaya dalam peperiksaan.", opts: ["supaya", "kerana", "tetapi", "atau"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["pengalaman", "pengalamaan", "pengalammaan", "pengalamman"] },
      { type: "kata-sendi", q: "Kami pergi berkelah ___ tepi sungai.", opts: ["di", "ke", "dari", "oleh"] },
      { type: "imbuhan", q: "Pilih kata berimbuhan 'meN-' yang betul bagi 'sapu'.", opts: ["menyapu", "mensapu", "memsapu", "memnyapu"] },
      { type: "simpulan-bahasa", q: "'Naik angin' bermaksud seseorang yang...", opts: ["sedang marah", "naik kapal terbang", "berasa sejuk", "suka berlari"] },
    ],
    C: [
      { type: "kbat", img: "♻️🗑️", q: "Sekolah Aina mempunyai banyak sampah plastik setiap hari. Cikgu mencadangkan program kitar semula. Apakah kebaikan utama program kitar semula ini kepada sekolah?", opts: ["Mengurangkan sampah dan menjaga alam sekitar", "Menambah kerja murid", "Menjadikan sekolah lebih kotor", "Membazirkan masa rehat"] },
      { type: "kbat", img: "📚⏰", q: "Razak selalu menangguhkan kerja sekolah sehingga ke saat akhir. Akibatnya dia tergesa-gesa dan banyak membuat kesilapan. Apakah pengajaran yang boleh diambil daripada situasi Razak?", opts: ["Kita harus menguruskan masa dengan baik dan tidak bertangguh", "Kerja sekolah tidak penting", "Tergesa-gesa adalah cara terbaik", "Kesilapan tidak memberi kesan"] },
      { type: "kbat", img: "🌧️🌾", q: "Musim kemarau yang panjang menyebabkan tanaman padi petani layu. Apakah kesan paling mungkin akibat kemarau ini kepada petani?", opts: ["Hasil tuaian berkurangan dan pendapatan petani terjejas", "Hasil tuaian bertambah", "Petani menjadi lebih kaya", "Tiada kesan langsung"] },
      { type: "kbat", img: "🚲⚠️", q: "Danial menunggang basikal tanpa memakai topi keledar lalu terjatuh dan cedera kepala. Apakah tindakan pencegahan yang patut Danial ambil pada masa hadapan?", opts: ["Memakai topi keledar setiap kali menunggang basikal", "Berhenti menunggang basikal selama-lamanya", "Menunggang basikal lebih laju", "Tidak perlu mengambil sebarang tindakan"] },
      { type: "kbat", img: "🤝👫", q: "Farah melihat seorang murid baharu duduk bersendirian di kantin. Apakah tindakan terbaik yang patut Farah lakukan?", opts: ["Menghampiri dan mengajak murid itu berkenalan", "Mengabaikan murid itu", "Mengejek murid itu", "Memberitahu semua kawan supaya menjauhinya"] },
      { type: "kbat", img: "🌊🌴", q: "Penduduk kampung tepi pantai bergantung pada laut untuk mencari rezeki. Namun, terdapat laporan sampah plastik mencemari laut. Apakah cadangan terbaik untuk menangani masalah ini?", opts: ["Hentikan pembuangan sampah ke laut dan jalankan kempen kesedaran", "Pindahkan semua penduduk dari tepi pantai", "Biarkan sampah di laut kerana laut sangat luas", "Tutup laut daripada nelayan"] },
      { type: "kbat", img: "🏗️🌳", q: "Sebuah kawasan hutan akan ditebang untuk membina taman perumahan baharu. Apakah kesan negatif yang paling mengkhuatirkan akibat penebangan hutan ini?", opts: ["Hidupan liar kehilangan habitat dan berlaku pencemaran udara", "Lebih banyak rumah untuk penduduk", "Kawasan menjadi lebih cantik", "Tiada kesan negatif"] },
      { type: "kbat", img: "📰📡", q: "Seorang murid membaca berita di internet yang mendakwa ada wabak penyakit baharu di kawasan sekolah. Apakah langkah bijak yang patut diambil sebelum mempercayai dan menyebarkan berita itu?", opts: ["Semak kebenaran berita dengan sumber yang dipercayai sebelum berkongsi", "Segera sebarkan kepada semua kawan", "Percaya sepenuhnya kerana ada di internet", "Abaikan berita itu terus"] },
      { type: "kbat", img: "💡🔋", q: "Sekolah mendapati bil elektrik mereka sangat tinggi. Apakah langkah paling berkesan yang boleh dilakukan oleh murid-murid untuk membantu mengurangkan penggunaan elektrik?", opts: ["Padam lampu dan kipas apabila tidak digunakan", "Biarkan lampu menyala sepanjang masa", "Minta sekolah beli lampu baharu", "Tidak perlu risau tentang bil elektrik sekolah"] },
      { type: "kbat", img: "🧒👴", q: "Tok Mat yang sudah berusia sukar berjalan dan tidak boleh menguruskan ladangnya. Anak-anaknya tinggal jauh di bandar. Apakah tindakan terbaik sebagai jiran yang prihatin?", opts: ["Tawarkan bantuan seperti membantu kerja ladang atau keperluan harian", "Biarkan sahaja kerana itu bukan urusan kita", "Tanya dulu apa masalahnya, kemudian tidak buat apa-apa", "Hubungi media massa untuk siarkan berita tentang Tok Mat"] },
      { type: "kbat", img: "🥗🍭", q: "Kantin sekolah banyak menjual makanan manis dan bergoreng. Murid-murid lebih suka membeli makanan tersebut berbanding buah-buahan dan sayur. Apakah cadangan untuk pengetua sekolah?", opts: ["Tambahkan pilihan makanan berkhasiat di kantin dan didik murid tentang pemakanan sihat", "Tutup kantin sekolah", "Biarkan murid makan apa yang mereka suka", "Naikkan harga makanan manis"] },
      { type: "kbat", img: "🚌🏫", q: "Bas sekolah selalu penuh dan ramai murid terpaksa berdiri semasa dalam perjalanan. Ini membahayakan keselamatan murid. Apakah cadangan penyelesaian terbaik?", opts: ["Tambah bilangan bas sekolah atau aturkan jadual bergilir", "Suruh murid berjalan kaki walaupun jauh", "Biarkan keadaan ini berterusan", "Naikkan tambang bas"] },
      { type: "kbat", img: "📖🌐", q: "Teknologi internet membolehkan murid mencari maklumat dengan cepat. Namun begitu, tidak semua maklumat di internet adalah tepat. Apakah kemahiran terpenting yang perlu ada pada murid semasa mencari maklumat di internet?", opts: ["Kemahiran menilai dan memilih maklumat yang tepat dan dipercayai", "Kemahiran menaip dengan pantas", "Kemahiran memuat turun gambar", "Kemahiran bermain permainan dalam talian"] },
      { type: "kbat", img: "🌡️🏥", q: "Sebuah kampung mengalami wabak denggi yang serius kerana banyak takungan air di kawasan perumahan. Apakah tindakan paling berkesan untuk membendung wabak ini?", opts: ["Buang takungan air dan fogging, serta tingkatkan kebersihan kawasan", "Biarkan nyamuk membiak", "Pindahkan semua penduduk keluar dari kampung", "Hanya bergantung kepada fogging sahaja tanpa tindakan lain"] },
      { type: "kbat", img: "🎭🎪", q: "Guru menganjurkan pertunjukan bakat sekolah. Haris ingin menyertai tetapi berasa gugup dan takut membuat kesilapan di hadapan ramai orang. Apakah nasihat terbaik untuk Haris?", opts: ["Berlatih dengan bersungguh-sungguh dan yakin pada diri sendiri", "Tidak perlu menyertai pertunjukan tersebut", "Meniru persembahan orang lain", "Meminta orang lain ganti tempatnya"] },
      { type: "kbat", img: "🌸🌍", q: "Hari Alam Sekitar Sedunia disambut setiap tahun pada 5 Jun. Kelas Amirul mahu menyumbang sesuatu yang bermakna. Apakah projek yang PALING memberi kesan kepada alam sekitar?", opts: ["Menanam pokok dan kempen kurangkan penggunaan plastik", "Melukis gambar alam sekitar sahaja", "Menyambut dengan makan-makan sahaja", "Menonton dokumentari alam sekitar"] },
      { type: "kbat", img: "🏘️🤲", q: "Banjir kilat melanda kawasan perumahan. Banyak keluarga kehilangan harta benda dan memerlukan bantuan. Apakah cara terbaik untuk pelajar sekolah rendah turut membantu mangsa banjir?", opts: ["Menyumbangkan pakaian dan makanan yang masih elok kepada mangsa", "Pergi melawat kawasan banjir untuk bergambar", "Biarkan kerajaan sahaja yang bertindak", "Menyebarkan gambar mangsa di media sosial tanpa kebenaran"] },
      { type: "kbat", img: "✏️📝", q: "Dalam kertas ujian, Rania mendapati soalan nombor 5 sangat susah dan dia tidak tahu menjawabnya. Apakah strategi terbaik yang patut Rania gunakan?", opts: ["Tinggalkan soalan itu dahulu, jawab soalan lain, kemudian kembali semula kepada soalan 5", "Tulis apa sahaja walaupun tidak tahu", "Salin jawapan kawan", "Biarkan kosong tanpa cuba menjawab"] },
      { type: "kbat", img: "🌵💧", q: "Kawasan tertentu di dunia menghadapi masalah kekurangan air bersih yang teruk. Apakah kaedah yang paling lestari untuk mengatasi masalah ini dalam jangka masa panjang?", opts: ["Kitar semula air, jimat penggunaan air, dan bina takungan air baru", "Jual air kepada penduduk pada harga tinggi", "Biarkan masalah itu berlanjutan", "Hanya bergantung pada hujan semata-mata"] },
      { type: "kbat", img: "👥🗣️", q: "Semasa perbincangan kumpulan, Tasha sentiasa mendominasi perbualan tanpa memberi peluang kepada ahli kumpulan lain untuk bercakap. Apakah kesan tindakan Tasha terhadap kumpulan mereka?", opts: ["Ahli kumpulan lain berasa tidak dihargai dan kerjasama dalam kumpulan mungkin terjejas", "Kumpulan menjadi lebih berjaya", "Semua ahli berasa gembira", "Tidak ada sebarang kesan"] },
    ],
  },
  4: {
    A: [
      { type: "kata-ganda", q: "Pilih contoh kata ganda penuh.", opts: ["rumah-rumah", "warna-warni", "sayur-mayur", "lauk-pauk"] },
      { type: "golongan-kata", q: "'Cantik' tergolong dalam golongan kata...", opts: ["kata adjektif", "kata kerja", "kata nama", "kata hubung"] },
      { type: "imbuhan", q: "Pilih kata berimbuhan 'peN-' yang betul bagi 'tulis'.", opts: ["penulis", "petulis", "penyulis", "pentulis"] },
      { type: "ayat", q: "'Kucing itu dikejar oleh anjing' ialah jenis ayat...", opts: ["pasif", "aktif", "tunggal", "seruan"] },
      { type: "peribahasa", q: "'Bagai aur dengan tebing' bermaksud...", opts: ["hubungan saling membantu", "bermusuhan", "sangat sedih", "tergesa-gesa"] },
      { type: "kosa-kata", q: "Proses tumbuhan menghasilkan makanan menggunakan cahaya matahari dipanggil...", opts: ["fotosintesis", "respirasi", "penyejatan", "perkumuhan"] },
      { type: "kata-ganda", q: "Pilih contoh kata ganda berentak.", opts: ["lauk-pauk", "rumah-rumah", "kanak-kanak", "warna-warna"] },
      { type: "golongan-kata", q: "'Berlari' tergolong dalam golongan kata...", opts: ["kata kerja", "kata nama", "kata adjektif", "kata sendi"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["pengetahuan", "pengetahuhan", "pengetauan", "pengtahuan"] },
      { type: "ayat", q: "Ayat aktif bagi 'Surat itu ditulis oleh saya' ialah...", opts: ["Saya menulis surat itu", "Surat itu saya tulis", "Saya menulisi surat", "Surat menulis saya"] },
      { type: "kata-ganda", q: "Apakah jenis kata ganda bagi 'warna-warni'?", opts: ["kata ganda berentak", "kata ganda penuh", "kata ganda separa", "bukan kata ganda"] },
      { type: "golongan-kata", q: "'Dengan pantas' — 'dengan' tergolong dalam golongan kata...", opts: ["kata sendi nama", "kata adjektif", "kata nama", "kata kerja"] },
      { type: "imbuhan", q: "Pilih kata berimbuhan 'peN-...-an' yang betul bagi 'ajar'.", opts: ["pengajaran", "pelajaran", "pengajarkan", "peajaran"] },
      { type: "ayat", q: "Ubah ayat aktif ini kepada ayat pasif: 'Ali memukul bola itu.'", opts: ["Bola itu dipukul oleh Ali", "Ali dipukul oleh bola", "Bola memukul Ali itu", "Dipukul Ali bola itu"] },
      { type: "peribahasa", q: "'Seperti menatang minyak yang penuh' bermaksud...", opts: ["menjaga sesuatu dengan penuh kasih sayang", "sangat marah", "membazirkan sesuatu", "berlari pantas"] },
      { type: "kata-ganda", q: "Apakah jenis kata ganda bagi 'lelaki'?", opts: ["kata ganda separa", "kata ganda penuh", "kata ganda berentak", "bukan kata ganda"] },
      { type: "golongan-kata", q: "'Kerana', 'dan', 'tetapi' tergolong dalam golongan kata...", opts: ["kata hubung", "kata sendi", "kata adjektif", "kata nama"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["masyarakat", "masyrakat", "masyarakat", "masyrakat"] },
      { type: "ayat", q: "'Adik membaca buku itu' ialah jenis ayat...", opts: ["aktif", "pasif", "tanya", "seruan"] },
      { type: "peribahasa", q: "'Bersatu teguh, bercerai roboh' bermaksud...", opts: ["perpaduan mengukuhkan sesebuah kumpulan", "lebih baik berpisah", "tidak perlu bekerjasama", "perpaduan tidak penting"] },
    ],
    B: [
      { type: "kata-ganda", q: "Pilih contoh kata ganda separa.", opts: ["lelaki", "rumah-rumah", "sayur-mayur", "tinggi-tinggi"] },
      { type: "golongan-kata", q: "'Di', 'ke', 'dari' tergolong dalam golongan kata...", opts: ["kata sendi nama", "kata kerja", "kata adjektif", "kata nama"] },
      { type: "imbuhan", q: "Pilih kata berimbuhan 'peN-...-an' yang betul bagi 'didik'.", opts: ["pendidikan", "pedidikan", "penididikan", "pendididkan"] },
      { type: "ayat", q: "'Ali membaca buku itu' ialah jenis ayat...", opts: ["aktif", "pasif", "seruan", "tanya"] },
      { type: "peribahasa", q: "'Berat sama dipikul, ringan sama dijinjing' bermaksud...", opts: ["bekerjasama dalam susah dan senang", "berseorangan", "tamak", "malas"] },
      { type: "kosa-kata", q: "Air yang turun dari langit semasa ribut dipanggil...", opts: ["hujan", "embun", "kabus", "salji"] },
      { type: "golongan-kata", q: "'Sangat', 'hanya', 'juga' tergolong dalam golongan kata...", opts: ["kata penguat/penegas", "kata nama", "kata kerja", "kata adjektif"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["persekitaran", "persekitarran", "persekitaraan", "presekitaran"] },
      { type: "ayat", q: "Ayat pasif bagi 'Saya menanam pokok itu' ialah...", opts: ["Pokok itu saya tanam", "Saya tanam pokok itu", "Pokok itu menanam saya", "Saya ditanam pokok"] },
      { type: "peribahasa", q: "'Seperti aur dengan tebing' merujuk kepada hubungan yang...", opts: ["saling memerlukan", "bermusuhan", "tiada kaitan", "sementara"] },
      { type: "kata-ganda", q: "Apakah makna 'bermain-main'?", opts: ["bermain sesuka hati/tidak bersungguh", "bermain sekali sahaja", "tidak pernah bermain", "bermain dengan pantas"] },
      { type: "golongan-kata", q: "'Tidur' dalam ayat 'Adik sedang tidur' ialah golongan kata...", opts: ["kata kerja", "kata nama", "kata adjektif", "kata sendi"] },
      { type: "imbuhan", q: "Pilih kata berimbuhan 'ke-...-an' yang betul bagi 'sakit'.", opts: ["kesakitan", "kesakitan", "kenyakitan", "sakit-sakitan"] },
      { type: "ayat", q: "Pilih ayat pasif yang betul.", opts: ["Buah itu dipetik oleh emak", "Emak memetik buah itu", "Dipetik emak buah", "Buah emak dipetik"] },
      { type: "peribahasa", q: "'Bulat air kerana pembetung, bulat manusia kerana muafakat' bermaksud...", opts: ["keputusan yang baik lahir daripada muafakat bersama", "air sentiasa bulat", "manusia tidak boleh bulat", "keputusan dibuat bersendirian"] },
      { type: "kata-ganda", q: "Apakah jenis kata ganda bagi 'gunung-ganang'?", opts: ["kata ganda berentak", "kata ganda penuh", "kata ganda separa", "bukan kata ganda"] },
      { type: "golongan-kata", q: "'Meja' dalam ayat 'Meja itu baru' ialah golongan kata...", opts: ["kata nama", "kata kerja", "kata adjektif", "kata sendi"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["kemudahan", "kemuddahan", "kemudahhan", "kemudahaan"] },
      { type: "ayat", q: "Ubah kepada ayat aktif: 'Hadiah itu diberikan oleh guru.'", opts: ["Guru memberikan hadiah itu", "Hadiah diberikan guru", "Guru hadiah diberikan", "Diberikan guru hadiah itu"] },
      { type: "peribahasa", q: "'Sambil menyelam minum air' bermaksud...", opts: ["melakukan dua perkara sekaligus", "minum air semasa berenang", "membuat kerja dengan separuh hati", "membuang masa"] },
    ],
    C: [
      { type: "kbat", img: "🏭💨", q: "Sebuah kilang baharu membuang asap tebal berhampiran sebuah kampung. Penduduk kampung mula mengalami masalah pernafasan. Apakah punca utama masalah kesihatan penduduk kampung itu?", opts: ["Pencemaran udara akibat asap kilang", "Cuaca yang sejuk", "Penduduk kurang bersenam", "Penduduk makan terlalu banyak"] },
      { type: "kbat", img: "📱👀", q: "Hafiz menghabiskan lebih daripada lima jam sehari bermain telefon pintar dan kini matanya kerap berair serta prestasinya di sekolah merosot. Apakah cadangan terbaik untuk Hafiz?", opts: ["Mengehadkan masa penggunaan telefon pintar", "Membeli telefon yang lebih besar", "Bermain telefon pada waktu malam sahaja", "Berhenti bersekolah"] },
      { type: "kbat", img: "🌊🏖️", q: "Kawasan pantai mengalami hakisan teruk selepas pokok bakau ditebang untuk pembangunan. Apakah hubungan sebab-akibat dalam situasi ini?", opts: ["Penebangan bakau menyebabkan pantai mudah terhakis", "Hakisan pantai menyebabkan bakau ditebang", "Tiada kaitan antara kedua-dua peristiwa", "Pembangunan menghalang hakisan"] },
      { type: "kbat", img: "🥗🍔", q: "Dua orang murid, Amir dan Husna, mempunyai wang saku yang sama. Amir membeli makanan berkhasiat manakala Husna membeli makanan segera setiap hari. Ramalkan kesan jangka panjang terhadap kesihatan mereka.", opts: ["Amir berkemungkinan lebih sihat berbanding Husna", "Kedua-dua mereka akan sama sihat", "Husna akan lebih sihat", "Tiada kaitan antara pemakanan dan kesihatan"] },
      { type: "kbat", img: "🏆🥈", q: "Pasukan bola sepak sekolah kalah dalam perlawanan akhir walaupun telah berlatih bersungguh-sungguh. Apakah sikap terbaik yang patut ditunjukkan oleh pasukan itu?", opts: ["Menerima kekalahan dengan lapang dada dan terus berlatih", "Menyalahkan pengadil sepenuhnya", "Berhenti bermain bola sepak", "Bergaduh dengan pasukan lawan"] },
      { type: "kbat", img: "🌱🌍", q: "Program Sekolah Hijau menggalakkan murid menanam sayur-sayuran dalam pasu di sekolah. Selain mendapat bekalan sayur segar, apakah faedah LAIN yang boleh diperoleh daripada program ini?", opts: ["Murid belajar bertanggungjawab, bersabar, dan menghargai alam sekitar", "Murid tidak perlu ke kantin lagi", "Sekolah boleh menjual sayur untuk keuntungan semata-mata", "Tidak ada faedah lain"] },
      { type: "kbat", img: "📊📉", q: "Jadual menunjukkan bilangan murid yang tidak hadir ke sekolah meningkat dari 5 orang pada Januari kepada 23 orang pada Mac. Apakah kemungkinan besar punca peningkatan ketidakhadiran ini?", opts: ["Berlakunya wabak penyakit atau masalah kesihatan di kalangan murid", "Sekolah mengadakan lebih banyak cuti", "Murid-murid semakin pandai", "Bilangan guru bertambah"] },
      { type: "kbat", img: "🧪🔬", q: "Seorang saintis melakukan kajian tentang kesan baja kepada pertumbuhan padi. Beliau mendapati padi yang dibaja tumbuh lebih tinggi berbanding padi yang tidak dibaja. Apakah kesimpulan yang boleh dibuat?", opts: ["Penggunaan baja dapat membantu pertumbuhan padi", "Padi tidak memerlukan baja langsung", "Baja menjadikan padi tidak sihat", "Ketinggian padi tidak berkaitan dengan baja"] },
      { type: "kbat", img: "🏙️🌆", q: "Bandar semakin sesak dengan kenderaan peribadi. Kerajaan merancang membina lebih banyak lebuh raya. Adakah ini penyelesaian yang paling tepat? Kenapa?", opts: ["Tidak semestinya; lebih baik tingkatkan pengangkutan awam untuk kurangkan kenderaan di jalan raya", "Ya, lebuh raya lebih banyak pasti menyelesaikan masalah kesesakan", "Kesesakan tidak boleh diatasi langsung", "Larang semua kenderaan dari masuk ke bandar"] },
      { type: "kbat", img: "🤳📲", q: "Murid-murid mendapati berita palsu (fake news) sering tersebar dalam kumpulan pesanan segera keluarga mereka. Apakah tanggungjawab murid apabila menerima berita yang mencurigakan?", opts: ["Semak fakta dengan sumber yang dipercayai sebelum menyebarkan semula", "Sebarkan terus kerana ia menarik", "Abaikan semua berita dalam pesanan segera", "Percaya sepenuhnya kerana dihantar oleh ahli keluarga"] },
      { type: "kbat", img: "🌺🏡", q: "Kawasan kejiranan Hazwan dulunya bersih dan damai, tetapi kini dipenuhi graffiti dan sampah. Apakah pendekatan terbaik untuk memulihkan keindahan kawasan kejiranan itu?", opts: ["Anjurkan gotong-royong, pasang notis anti-vandal, dan tanam pokok hiasan", "Biarkan sahaja kerana bukan tanggungjawab kita", "Pindah ke kawasan lain", "Hanya lapor kepada pihak berkuasa tanpa berbuat apa-apa"] },
      { type: "kbat", img: "💸🏫", q: "Sekolah ingin membeli komputer baharu untuk semua kelas tetapi kekurangan dana. Pelajar-pelajar mencadangkan beberapa cara untuk mengumpul wang. Apakah cara yang paling wajar dan beretika?", opts: ["Jual makanan dalam jualan amal sekolah atau minta derma daripada ibu bapa", "Minta semua murid berikan wang simpanan mereka", "Curi wang dari peti derma masjid", "Paksa peniaga sekitar sekolah untuk menderma"] },
      { type: "kbat", img: "🧑‍🏫📋", q: "Cikgu Laila mendapati ramai muridnya gagal dalam ujian tatabahasa. Beliau ingin mengubah cara pengajaran untuk membantu murid. Apakah pendekatan PALING berkesan yang boleh digunakan?", opts: ["Gunakan permainan, kuiz interaktif, dan latihan tambahan yang menarik", "Beri murid lebih banyak hukuman jika gagal", "Ajar dengan cara yang sama seperti sebelumnya", "Hapuskan ujian tatabahasa"] },
      { type: "kbat", img: "🌳🪵", q: "Syarikat pembalakan merancang menebang hutan tropika untuk dijadikan ladang sawit. Nyatakan DUA kesan negatif tindakan ini terhadap alam sekitar.", opts: ["Kehilangan habitat hidupan liar dan peningkatan pelepasan karbon dioksida", "Lebih banyak minyak sawit dan pengurangan pencemaran", "Lebih banyak tanah untuk pertanian dan lebih banyak hujan", "Peningkatan biodiversiti dan udara lebih bersih"] },
      { type: "kbat", img: "🤒💊", q: "Encik Karim menghidap kencing manis tetapi masih suka makan makanan bergula. Doktor telah memberi amaran berkali-kali. Apakah kemungkinan akibat jangka panjang jika Encik Karim tidak mengubah tabiat makannya?", opts: ["Penyakitnya akan bertambah teruk dan mungkin membawa kepada komplikasi serius", "Kencing manisnya akan sembuh sendiri", "Dia akan menjadi lebih sihat", "Tidak ada sebarang akibat"] },
      { type: "kbat", img: "🏫🎭", q: "Sekolah ingin mewakili negeri dalam pertandingan forum pelajar peringkat kebangsaan. Apakah ciri-ciri pelajar yang PALING sesuai dipilih untuk mewakili sekolah?", opts: ["Berkeyakinan, petah bercakap, berpengetahuan luas, dan boleh berfikir secara kritis", "Hanya yang paling tinggi dan cantik sahaja", "Yang paling banyak kawan sahaja", "Hanya murid yang mendapat A dalam semua mata pelajaran"] },
      { type: "kbat", img: "📚🌏", q: "Malaysia mempunyai tiga kaum utama: Melayu, Cina, dan India. Apakah kepentingan murid-murid pelbagai kaum belajar dalam satu sekolah yang sama?", opts: ["Memupuk perpaduan, saling memahami, dan mewujudkan semangat Malaysia yang tulen", "Menyebabkan lebih banyak perbalahan", "Mengurangkan pencapaian akademik", "Tidak memberi sebarang faedah"] },
      { type: "kbat", img: "⚡🌞", q: "Sebuah kampung di pedalaman belum mempunyai bekalan elektrik. Pihak berkuasa sedang mempertimbangkan dua pilihan: membina stesen janaelektrik diesel atau memasang panel solar. Manakah pilihan LEBIH lestari?", opts: ["Panel solar kerana ia menggunakan tenaga boleh diperbaharui dan mesra alam", "Stesen diesel kerana lebih murah pada peringkat awal", "Kedua-dua sama sahaja", "Kampung tidak perlu elektrik"] },
      { type: "kbat", img: "🎓📝", q: "Rashdan mendapat keputusan ujian yang sangat baik tetapi dia menggunakan kaedah hafalan semata-mata. Apakah kelemahan utama kaedah pembelajaran ini?", opts: ["Dia mungkin tidak memahami konsep sebenar dan mudah lupa jika tidak ulang kaji", "Hafalan adalah kaedah terbaik tanpa sebarang kelemahan", "Dia tidak perlu belajar lagi", "Keputusan ujian yang baik membuktikan dia faham sepenuhnya"] },
      { type: "kbat", img: "🌧️🚿", q: "Air bersih semakin berkurangan akibat pertambahan penduduk dan pencemaran sumber air. Apakah yang PALING wajar dilakukan oleh setiap individu dalam kehidupan seharian untuk menangani isu ini?", opts: ["Amalkan penjimatan air dalam aktiviti harian dan jangan mencemarkan sumber air", "Gunakan air sebanyak yang dikehendaki kerana air sentiasa ada", "Bergantung kepada kerajaan sepenuhnya untuk menyelesaikan masalah", "Beli air mineral sahaja dan buang sumber air semula jadi"] },
    ],
  },
  5: {
    A: [
      { type: "kata-majmuk", q: "Pilih contoh kata majmuk yang betul.", opts: ["kapal terbang", "kapalterbang", "kapal-terbang", "kapalan terbang"] },
      { type: "penjodoh-bilangan", q: "Lima ___ kerbau sedang meragut di padang.", opts: ["ekor", "batang", "buah", "orang"] },
      { type: "ayat-majmuk", q: "'Saya membeli buku yang baharu diterbitkan itu' ialah contoh ayat majmuk...", opts: ["pancangan relatif", "gabungan", "tunggal", "seruan"] },
      { type: "imbuhan", q: "Pilih kata berimbuhan apitan 'ke-...-an' yang betul bagi 'indah'.", opts: ["keindahan", "kindahan", "keindahaan", "keindaan"] },
      { type: "perumpamaan", q: "'Bagai katak di bawah tempurung' bermaksud seseorang yang...", opts: ["berpandangan sempit", "sangat rajin", "pandai berenang", "suka melancong"] },
      { type: "kosa-kata", q: "Sistem yang membawa darah ke seluruh badan dipanggil sistem...", opts: ["peredaran darah", "pencernaan", "pernafasan", "saraf"] },
      { type: "penjodoh-bilangan", q: "Dua ___ kertas itu telah dikoyakkan.", opts: ["helai", "ekor", "batang", "biji"] },
      { type: "kata-majmuk", q: "Pilih contoh kata majmuk yang betul.", opts: ["jam tangan", "jamtangan", "jam-tangan", "jamantangan"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["mempersembahkan", "memperasembahkan", "mempersembakan", "memersembahkan"] },
      { type: "ayat-majmuk", q: "Kata hubung pancangan relatif yang biasa digunakan ialah...", opts: ["yang", "dan", "atau", "kerana"] },
      { type: "kata-majmuk", q: "Pilih contoh kata majmuk yang betul.", opts: ["tandas awam", "tandasawam", "tandas-awam", "awam tandas"] },
      { type: "penjodoh-bilangan", q: "Tiga ___ payung itu telah rosak.", opts: ["batang", "ekor", "helai", "orang"] },
      { type: "imbuhan", q: "Pilih kata berimbuhan 'memper-...-kan' yang betul bagi 'baik'.", opts: ["memperbaikan", "membaikan", "perbaikan", "memperbaikkan"] },
      { type: "perumpamaan", q: "'Bagai enau dalam belukar, melepaskan pucuk masing-masing' bermaksud...", opts: ["setiap orang mementingkan diri sendiri", "bekerjasama dengan baik", "saling membantu", "berpadanan antara satu sama lain"] },
      { type: "kosa-kata", q: "Perjanjian rasmi antara dua negara atau lebih dipanggil...", opts: ["perjanjian/treaty", "undang-undang", "peraturan", "akta"] },
      { type: "ayat-majmuk", q: "'Dia belajar dengan tekun supaya lulus peperiksaan' ialah ayat majmuk pancangan...", opts: ["keterangan tujuan", "relatif", "gabungan", "seruan"] },
      { type: "penjodoh-bilangan", q: "Empat ___ murid telah dipilih untuk wakili sekolah.", opts: ["orang", "ekor", "batang", "helai"] },
      { type: "kata-majmuk", q: "Pilih kata majmuk yang dieja sebagai satu perkataan kerana sudah mantap.", opts: ["suruhanjaya", "suruhan jaya", "suruhan-jaya", "jaya suruhan"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["bertanggungjawab", "bertanggungjawap", "bertanggongjawab", "bertangungjawab"] },
      { type: "perumpamaan", q: "'Seperti bulan dipagar bintang' bermaksud orang yang...", opts: ["dikelilingi ramai orang yang menyayanginya", "hidup bersendirian", "sangat pandai", "tidak disenangi orang lain"] },
    ],
    B: [
      { type: "kata-majmuk", q: "Pilih contoh kata majmuk yang betul.", opts: ["meja makan", "mejamakan", "meja-makan", "mejaan makan"] },
      { type: "penjodoh-bilangan", q: "Tiga ___ pisang itu telah masak.", opts: ["sikat", "ekor", "helai", "orang"] },
      { type: "imbuhan", q: "Pilih kata berimbuhan 'memper-...-kan' yang betul bagi 'kenal'.", opts: ["memperkenalkan", "mengenalkan", "perkenalkan", "mempkenalkan"] },
      { type: "perumpamaan", q: "'Air dicincang tidak akan putus' bermaksud...", opts: ["pergaduhan antara saudara akan reda semula", "air sukar dipotong", "kerja yang mustahil", "perpisahan kekal"] },
      { type: "kosa-kata", q: "Proses tumbuhan kehilangan wap air melalui daun dipanggil...", opts: ["transpirasi/penyejatan", "fotosintesis", "respirasi", "pembiakan"] },
      { type: "ayat-majmuk", q: "'Walaupun letih, dia tetap membantu ibunya' ialah ayat majmuk...", opts: ["pancangan keterangan", "gabungan", "tunggal", "tanya"] },
      { type: "penjodoh-bilangan", q: "Sebuah ___ kapal terdampar di pantai.", opts: ["buah", "ekor", "orang", "batang"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["pertanggungjawaban", "pertanggungjawapan", "pertanggongjawaban", "pertangungjawaban"] },
      { type: "perumpamaan", q: "'Bagai pinang dibelah dua' bermaksud...", opts: ["dua orang yang sangat serupa", "berlainan sama sekali", "sangat tinggi", "sukar dibahagi"] },
      { type: "kata-majmuk", q: "Pilih kata majmuk yang sudah mantap dieja sebagai satu perkataan.", opts: ["setiausaha", "set iausaha", "setia-usaha", "setiaUsaha"] },
      { type: "kata-majmuk", q: "Pilih contoh kata majmuk yang betul.", opts: ["balai raya", "balairaya", "balai-raya", "raya balai"] },
      { type: "penjodoh-bilangan", q: "Dua ___ kereta itu telah dijual.", opts: ["buah", "ekor", "helai", "batang"] },
      { type: "imbuhan", q: "Pilih kata berimbuhan 'memper-' yang betul bagi 'luas'.", opts: ["memperluaskan", "perluaskan", "meluaskan", "memperluas"] },
      { type: "perumpamaan", q: "'Bagai aur ditarik, lembing disorong' bermaksud...", opts: ["serba salah / dalam dilema", "sangat senang", "cepat bertindak", "sangat marah"] },
      { type: "kosa-kata", q: "Mesej yang dihantar antara negara melalui wakil diplomatik dipanggil...", opts: ["nota diplomatik", "surat cinta", "laporan berita", "aduan rasmi"] },
      { type: "ayat-majmuk", q: "'Dia berjaya kerana dia rajin belajar' ialah ayat majmuk pancangan...", opts: ["keterangan sebab", "relatif", "gabungan", "tujuan"] },
      { type: "penjodoh-bilangan", q: "Lima ___ lada ini terlalu pedas.", opts: ["biji", "ekor", "batang", "helai"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["mempersembahkan", "memperasembahkan", "mempersembakan", "memersembahkan"] },
      { type: "perumpamaan", q: "'Seperti kacang lupakan kulit' bermaksud orang yang...", opts: ["lupa asal usul setelah berjaya", "sangat ingat budi", "rajin menabung", "amat berhati-hati"] },
      { type: "kata-majmuk", q: "Pilih kata majmuk yang sudah mantap dieja sebagai satu perkataan.", opts: ["tandatangan", "tanda tangan", "tanda-tangan", "tandasdatangan"] },
    ],
    C: [
      { type: "kbat", img: "🌍🌡️", q: "Suhu dunia semakin meningkat akibat pelepasan gas rumah hijau yang berlebihan daripada kenderaan dan kilang. Apakah langkah yang PALING berkesan untuk individu mengurangkan masalah ini?", opts: ["Menggunakan pengangkutan awam dan menjimatkan tenaga", "Membeli lebih banyak kereta", "Menanam lebih sedikit pokok", "Membakar lebih banyak sampah"] },
      { type: "kbat", img: "💧🚰", q: "Sebuah kampung mengalami kekurangan air bersih kerana sungai berhampiran tercemar oleh sisa kilang. Apakah kesan jangka panjang situasi ini jika tiada tindakan diambil?", opts: ["Penduduk akan menghadapi masalah kesihatan dan kekurangan sumber air", "Penduduk akan mendapat lebih banyak air bersih", "Sungai akan menjadi lebih bersih dengan sendirinya", "Tiada kesan kepada penduduk"] },
      { type: "kbat", img: "📊💡", q: "Dalam satu kajian, murid yang membaca sekurang-kurangnya 30 minit sehari menunjukkan pencapaian akademik yang lebih baik. Apakah kesimpulan yang paling wajar?", opts: ["Tabiat membaca dapat meningkatkan pencapaian akademik murid", "Membaca tidak memberi sebarang kesan", "Semua murid akan gagal jika tidak membaca", "Membaca hanya penting untuk peperiksaan"] },
      { type: "kbat", img: "🧓🏠", q: "Pak Razak yang sudah tua tinggal bersendirian dan jarang dikunjungi oleh sesiapa. Sebagai seorang jiran yang prihatin, apakah tindakan terbaik yang boleh dilakukan?", opts: ["Melawat dan membantu keperluan harian Pak Razak", "Mengabaikan Pak Razak kerana bukan urusan kita", "Memberitahu semua orang tentang keadaannya tanpa membantu", "Berpindah ke kawasan lain"] },
      { type: "kbat", img: "🚌🕒", q: "Bas sekolah sering lewat sampai kerana terperangkap dalam kesesakan lalu lintas pada waktu pagi. Apakah cadangan yang paling praktikal untuk mengatasi masalah ini?", opts: ["Menjadualkan waktu perjalanan lebih awal", "Membatalkan perkhidmatan bas sekolah", "Menukar laluan setiap hari secara rawak", "Membiarkan masalah ini berterusan"] },
      { type: "kbat", img: "🏫🌱", q: "Sekolah merancang mewujudkan 'Sudut Hijau' dengan menanam pokok buah-buahan dan sayuran. Apakah faedah LAIN selain daripada mendapat hasil tanaman?", opts: ["Murid belajar berkebun, menghargai alam sekitar, dan memupuk tanggungjawab", "Sekolah boleh tutup kantin", "Murid tidak perlu belajar sains", "Tidak ada faedah lain"] },
      { type: "kbat", img: "📱🔐", q: "Zana mendapati rakan sekelasnya berkongsi kata laluan (password) media sosial antara satu sama lain. Apakah risiko utama tindakan ini?", opts: ["Akaun boleh disalahguna oleh orang lain untuk menghantar mesej atau konten yang tidak sesuai", "Kata laluan menjadi lebih selamat", "Lebih ramai orang boleh membantu jika akaun bermasalah", "Tiada sebarang risiko"] },
      { type: "kbat", img: "⚖️👨‍⚖️", q: "Dalam sebuah cerita, seorang pelajar melihat rakannya menyalin jawapan daripada pelajar lain semasa peperiksaan tetapi berpura-pura tidak nampak. Apakah dilema etika yang dihadapi pelajar itu?", opts: ["Antara mempertahankan kejujuran atau melindungi perasaan rakan", "Antara memilih subjek yang disukai", "Antara tidur atau tidak semasa peperiksaan", "Tiada sebarang dilema"] },
      { type: "kbat", img: "🌾🚜", q: "Penggunaan racun serangga berlebihan oleh petani telah menyebabkan pencemaran air sungai dan kematian ikan. Apakah penyelesaian yang PALING lestari bagi masalah ini?", opts: ["Beralih kepada pertanian organik dan racun serangga mesra alam", "Teruskan penggunaan racun serangga dengan kuantiti yang lebih banyak", "Hentikan semua aktiviti pertanian", "Biarkan pencemaran terus berlaku"] },
      { type: "kbat", img: "🏙️🌿", q: "Pembangunan pesat di bandar menyebabkan kawasan hijau semakin berkurangan. Apakah strategi yang paling seimbang antara pembangunan dan pemeliharaan alam sekitar?", opts: ["Rancang pembangunan mesra alam dengan taman bandar dan bangunan hijau", "Hentikan semua pembangunan di bandar", "Tebang semua pokok untuk bina lebih banyak bangunan", "Pindahkan semua penduduk ke luar bandar"] },
      { type: "kbat", img: "📰🔍", q: "Berita palsu tentang ubat ajaib yang boleh menyembuhkan semua penyakit tersebar meluas di media sosial. Banyak orang membeli produk itu. Apakah akibat paling serius jika orang ramai mempercayai berita palsu ini?", opts: ["Orang ramai boleh tertipu, rugi wang, dan mengabaikan rawatan perubatan yang betul", "Semua orang akan sembuh daripada penyakit", "Industri perubatan akan lebih maju", "Tiada akibat serius"] },
      { type: "kbat", img: "🧬💊", q: "Seorang pesakit mendapat dua pendapat berbeza daripada dua orang doktor tentang rawatan penyakitnya. Apakah tindakan terbaik yang patut diambil oleh pesakit?", opts: ["Dapatkan pendapat ketiga dan buat keputusan berasaskan bukti dan penjelasan yang jelas", "Ikut pendapat doktor pertama sahaja tanpa soal", "Abaikan kedua-dua pendapat dan rawat sendiri", "Berhenti mendapatkan rawatan perubatan"] },
      { type: "kbat", img: "🏗️♻️", q: "Sebuah syarikat pembinaan ingin membina kompleks membeli-belah di atas tapak yang sebelumnya merupakan kawasan hutan simpan. Daripada perspektif pembangunan lestari, apakah perkara yang perlu dipertimbangkan?", opts: ["Keseimbangan antara keperluan ekonomi dengan pemeliharaan ekosistem", "Keuntungan syarikat pembinaan sahaja", "Bilangan kedai dalam kompleks itu", "Rekabentuk bangunan yang menarik"] },
      { type: "kbat", img: "🎓🌍", q: "Malaysia merancang menghantar pelajar terbaik untuk belajar di luar negara. Apakah tanggungjawab pelajar-pelajar ini setelah tamat pengajian mereka?", opts: ["Kembali ke Malaysia dan menyumbang kepada pembangunan negara", "Kekal menetap di luar negara untuk selama-lamanya", "Tidak perlu balik ke Malaysia", "Hanya balik jika bergaji tinggi"] },
      { type: "kbat", img: "🌊💔", q: "Banjir besar melanda sebuah negeri dan menyebabkan ribuan keluarga terpaksa dipindahkan ke pusat pemindahan. Apakah cabaran utama yang dihadapi oleh mangsa banjir di pusat pemindahan?", opts: ["Kekurangan privasi, kebersihan, makanan, dan tekanan emosi", "Mendapat lebih banyak makanan dari biasa", "Mendapat lebih banyak ruang untuk berehat", "Tiada cabaran kerana pusat pemindahan selesa"] },
      { type: "kbat", img: "🤖🧠", q: "Kecerdasan buatan (AI) semakin banyak digunakan dalam pelbagai bidang termasuk pendidikan dan perubatan. Apakah kebimbangan utama tentang penggunaan AI yang terlalu meluas?", opts: ["Pergantungan berlebihan kepada AI boleh mengurangkan kemahiran berfikir manusia dan membimbangkan keselamatan data", "AI akan menjadikan manusia lebih bijak", "AI tidak ada sebarang kesan negatif", "AI hanya digunakan dalam permainan komputer"] },
      { type: "kbat", img: "🌏🤝", q: "Malaysia menghantar pasukan bantuan perubatan ke negara jiran yang dilanda bencana alam. Apakah nilai-nilai murni yang ditunjukkan oleh tindakan kerajaan Malaysia ini?", opts: ["Keperimanusiaan, kerjasama antarabangsa, dan semangat tolong-menolong", "Malaysia mencari keuntungan ekonomi", "Malaysia ingin menjajah negara jiran", "Tindakan ini tidak menunjukkan sebarang nilai"] },
      { type: "kbat", img: "📉💼", q: "Kadar pengangguran di kalangan graduan universiti semakin meningkat walaupun mereka mempunyai sijil akademik. Apakah punca utama yang paling mungkin menyebabkan masalah ini?", opts: ["Graduan kurang kemahiran insaniah dan pengalaman kerja yang diperlukan oleh majikan", "Terlalu ramai syarikat di Malaysia", "Graduan terlalu kaya untuk bekerja", "Kerajaan tidak membayar gaji yang mencukupi"] },
      { type: "kbat", img: "🏘️🌈", q: "Sebuah kawasan perumahan didiami oleh pelbagai kaum dan agama. Baru-baru ini berlaku perselisihan faham antara penduduk berkaitan penggunaan kemudahan awam. Apakah pendekatan terbaik untuk mewujudkan semula keharmonian?", opts: ["Adakan mesyuarat bersama, dengar pendapat semua pihak, dan cari penyelesaian secara muafakat", "Asingkan kemudahan mengikut kaum", "Biarkan perselisihan berlanjutan", "Lapor sahaja kepada pihak berkuasa tanpa berbincang"] },
      { type: "kbat", img: "🌡️❄️", q: "Perubahan iklim menyebabkan musim kemarau dan banjir yang lebih kerap di Malaysia. Apakah langkah-langkah adaptasi TERBAIK yang boleh diambil oleh masyarakat Malaysia untuk menghadapi cabaran ini?", opts: ["Bina sistem saliran yang baik, pelbagaikan pertanian, dan kurangkan jejak karbon", "Bergantung sepenuhnya kepada teknologi negara lain", "Tidak melakukan apa-apa kerana perubahan iklim tidak boleh dibendung", "Pindah semua penduduk ke negara lain"] },
    ],
  },
  6: {
    A: [
      { type: "ayat-songsang", q: "Ayat songsang bagi 'Murid itu sedang membaca buku' ialah...", opts: ["Sedang membaca buku murid itu", "Murid sedang itu membaca buku", "Buku murid itu sedang membaca", "Membaca murid itu sedang buku"] },
      { type: "kata-penegas", q: "'Dialah yang menjadi johan pertandingan itu' — kata penegas dalam ayat ini ialah...", opts: ["-lah", "yang", "itu", "menjadi"] },
      { type: "peribahasa", q: "'Melepaskan batuk di tangga' bermaksud...", opts: ["melakukan sesuatu secara tidak bersungguh-sungguh", "sangat rajin", "sentiasa gembira", "amat berhati-hati"] },
      { type: "kosa-kata", q: "Perkataan yang sesuai untuk 'usaha gigih tanpa berputus asa' ialah...", opts: ["gigih/tabah", "malas", "ceroboh", "lalai"] },
      { type: "imbuhan", q: "Pilih ayat dengan kata berimbuhan yang betul.", opts: ["Beliau mempertahankan haknya.", "Beliau memertahankan haknya.", "Beliau pertahankan haknya.", "Beliau mempertahanan haknya."] },
      { type: "tanda-baca", q: "Tanda baca yang betul untuk mengakhiri ayat tanya ialah...", opts: ["?", ".", "!", ","] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["bertanggungjawab", "bertanggungjawap", "bertanggongjawab", "bertangungjawab"] },
      { type: "peribahasa", q: "'Hangat-hangat tahi ayam' bermaksud...", opts: ["semangat yang tidak berkekalan", "sangat panas", "kerja yang kotor", "amat rajin"] },
      { type: "kosa-kata", q: "Lawan bagi kata 'mewah' ialah...", opts: ["daif/miskin", "kaya", "indah", "besar"] },
      { type: "ayat-songsang", q: "Bahagian yang dikedepankan dalam ayat songsang ialah...", opts: ["predikat", "subjek", "kata kerja sahaja", "kata sendi sahaja"] },
      { type: "ayat-songsang", q: "Ayat songsang bagi 'Peserta itu berlari dengan pantas' ialah...", opts: ["Berlari dengan pantas peserta itu", "Peserta berlari itu dengan pantas", "Dengan pantas berlari peserta", "Pantas berlari peserta itu dengan"] },
      { type: "kata-penegas", q: "'Makanlah dahulu sebelum pergi' — kata penegas dalam ayat ini ialah...", opts: ["-lah", "dahulu", "sebelum", "pergi"] },
      { type: "peribahasa", q: "'Pagar makan padi' bermaksud...", opts: ["orang yang diamanahkan menjaga sesuatu tetapi mengkhianati amanah itu", "pagar yang kuat", "padi yang banyak", "orang yang rajin bertani"] },
      { type: "kosa-kata", q: "Perkataan formal bagi 'badan kerajaan yang mengurus sesebuah negeri' ialah...", opts: ["kerajaan negeri/Majlis Mesyuarat Kerajaan Negeri", "syarikat swasta", "NGO", "persatuan sukarela"] },
      { type: "imbuhan", q: "Pilih ayat dengan kata berimbuhan 'memper-' yang betul.", opts: ["Usaha itu mempercepatkan proses pembangunan.", "Usaha itu mempercepat proses pembangunan.", "Usaha itu percepatkan proses pembangunan.", "Usaha itu di percepatkan proses pembangunan."] },
      { type: "tanda-baca", q: "Tanda baca yang digunakan untuk memisahkan kata dalam senarai ialah...", opts: ["koma (,)", "titik (.)", "tanda seru (!)", "tanda soal (?)"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["menyeluruh", "menyeluroh", "menyeloroh", "manyeluruh"] },
      { type: "peribahasa", q: "'Ikut resmi padi, makin berisi makin tunduk' bermaksud...", opts: ["orang yang semakin berilmu semakin merendah diri", "padi yang tunduk bererti sudah tua", "orang yang sombong semakin pandai", "padi hanya tunduk apabila angin bertiup"] },
      { type: "kosa-kata", q: "Perkataan yang bermaksud 'penuh dengan semangat dan tenaga' ialah...", opts: ["bersemangat/bertenaga", "lesu", "goyah", "layu"] },
      { type: "ayat-songsang", q: "Bina ayat songsang daripada 'Cikgu itu sangat penyayang'.", opts: ["Sangat penyayang cikgu itu", "Cikgu penyayang itu sangat", "Sangat cikgu itu penyayang", "Penyayang itu cikgu sangat"] },
    ],
    B: [
      { type: "ayat-songsang", q: "Ayat songsang bagi 'Bunga itu sangat harum' ialah...", opts: ["Sangat harum bunga itu", "Bunga sangat itu harum", "Harum bunga itu sangat", "Itu bunga sangat harum"] },
      { type: "kata-penegas", q: "Antara berikut, yang manakah kata penegas?", opts: ["sahaja, juga, jua", "dan, atau, tetapi", "di, ke, dari", "saya, kamu, dia"] },
      { type: "peribahasa", q: "'Bagai mencurah air ke daun keladi' bermaksud...", opts: ["nasihat yang tidak diendahkan", "kerja yang berjaya", "hujan lebat", "sangat licin"] },
      { type: "kosa-kata", q: "Perkataan formal bagi 'duit' ialah...", opts: ["wang", "syiling", "kertas", "harta"] },
      { type: "imbuhan", q: "Pilih ayat dengan kata berimbuhan yang betul.", opts: ["Kerajaan memperkasakan ekonomi luar bandar.", "Kerajaan perkasakan ekonomi luar bandar.", "Kerajaan memerkasakan ekonomi luar bandar.", "Kerajaan mengperkasakan ekonomi luar bandar."] },
      { type: "tanda-baca", q: "Tanda baca yang digunakan sebelum memulakan senarai ialah...", opts: ["titik bertindih (:)", "tanda seru (!)", "tanda soal (?)", "tanda petik (\" \")"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["menyeluruh", "menyeluroh", "menyeloroh", "manyeluruh"] },
      { type: "peribahasa", q: "'Seperti kacang lupakan kulit' bermaksud orang yang...", opts: ["lupa asal usul setelah berjaya", "sangat ingat budi", "rajin menabung", "amat berhati-hati"] },
      { type: "kosa-kata", q: "Perkataan yang membawa maksud 'pandangan atau buah fikiran' ialah...", opts: ["pendapat", "perintah", "pertanyaan", "pengakuan"] },
      { type: "ayat-songsang", q: "Ayat songsang biasanya digunakan untuk...", opts: ["memberi penegasan/penekanan", "memendekkan ayat", "menjadikan ayat lebih sukar", "menggantikan tanda baca"] },
      { type: "ayat-songsang", q: "Ayat songsang bagi 'Kami pergi ke pasar pagi ini' ialah...", opts: ["Ke pasar pagi ini kami pergi", "Kami ke pasar pagi ini pergi", "Pergi kami ke pasar pagi ini", "Pagi ini kami ke pasar pergi"] },
      { type: "kata-penegas", q: "'Hanya dia yang tahu rahsia itu' — kata penegas dalam ayat ini ialah...", opts: ["hanya", "dia", "yang", "itu"] },
      { type: "peribahasa", q: "'Berakit-rakit ke hulu, berenang-renang ke tepian; bersakit-sakit dahulu, bersenang-senang kemudian' bermaksud...", opts: ["perlu bersusah payah dahulu untuk menikmati kejayaan", "sentiasa bersenang-lenang", "berenang adalah cara terbaik untuk sampai ke tepian", "tidak perlu berusaha keras"] },
      { type: "kosa-kata", q: "Perkataan formal bagi 'kurang baik' dalam urusan rasmi ialah...", opts: ["tidak memuaskan/tidak memuaskan hati", "buruk", "hancur", "cacat"] },
      { type: "imbuhan", q: "Pilih ayat dengan imbuhan yang betul.", opts: ["Isu itu memperihalkan masalah rasuah di negara kita.", "Isu itu memerihalkan masalah rasuah di negara kita.", "Isu itu perihalkan masalah rasuah di negara kita.", "Isu itu memprihalkan masalah rasuah di negara kita."] },
      { type: "tanda-baca", q: "Tanda baca yang digunakan untuk menandakan dialog atau petikan langsung ialah...", opts: ["tanda petik (\" \")", "koma (,)", "titik (.)", "tanda soal (?)"] },
      { type: "ejaan", q: "Pilih ejaan yang betul.", opts: ["mempertanggungjawabkan", "mempetanggungjawabkan", "mempertanggongjawabkan", "mempertanggungjawapkan"] },
      { type: "peribahasa", q: "'Tepuk dada tanya selera' bermaksud...", opts: ["kita sendiri yang perlu membuat pertimbangan dan keputusan tentang diri sendiri", "tepuk dada untuk menenangkan diri", "tanya pendapat orang lain sebelum membuat keputusan", "jangan membuat sebarang keputusan"] },
      { type: "kosa-kata", q: "Perkataan yang bermaksud 'cara atau kaedah yang sistematik untuk mencapai sesuatu matlamat' ialah...", opts: ["strategi", "impian", "kejutan", "lakonan"] },
      { type: "ayat-songsang", q: "Ayat songsang bagi 'Mereka bekerja keras demi masa depan' ialah...", opts: ["Demi masa depan mereka bekerja keras", "Mereka masa depan bekerja keras demi", "Keras mereka bekerja demi masa depan", "Bekerja keras demi masa depan mereka"] },
    ],
    C: [
      { type: "kbat", img: "🏙️🚗", q: "Bandar yang semakin pesat membangun menghadapi masalah kesesakan lalu lintas dan pencemaran udara yang serius. Sebagai seorang perancang bandar, apakah cadangan PALING wajar untuk menangani kedua-dua masalah ini serentak?", opts: ["Memperkasakan sistem pengangkutan awam yang cekap", "Membina lebih banyak lebuh raya untuk kereta persendirian", "Melarang semua kenderaan masuk ke bandar", "Mengabaikan masalah tersebut"] },
      { type: "kbat", img: "📖✍️", q: "Seorang penulis muda gagal menerbitkan novel pertamanya beberapa kali sebelum akhirnya berjaya selepas bertahun-tahun berusaha. Apakah nilai murni yang paling jelas digambarkan melalui kisah penulis ini?", opts: ["Ketabahan dan semangat tidak berputus asa", "Sifat tamak", "Sifat malas", "Sifat mementingkan diri"] },
      { type: "kbat", img: "🌐🔒", q: "Ramai remaja berkongsi maklumat peribadi seperti alamat rumah di media sosial tanpa menyedari risikonya. Apakah kesan paling membimbangkan akibat tindakan ini?", opts: ["Risiko keselamatan diri dan penyalahgunaan maklumat oleh pihak tidak bertanggungjawab", "Mendapat lebih ramai kawan", "Menjadi lebih terkenal", "Tiada kesan buruk langsung"] },
      { type: "kbat", img: "🧑‍🤝‍🧑🗳️", q: "Dalam mesyuarat kelas, ramai murid mempunyai pendapat berbeza tentang aktiviti yang hendak dijalankan. Apakah cara terbaik untuk mencapai keputusan yang adil bagi semua?", opts: ["Membincangkan dan mengambil keputusan melalui undian majoriti", "Membiarkan seorang murid membuat keputusan sahaja", "Bergaduh sehingga seorang mengalah", "Membatalkan aktiviti sepenuhnya"] },
      { type: "kbat", img: "🏞️🛢️", q: "Sebuah syarikat ingin membuka lombong berhampiran kawasan hutan simpan yang menjadi habitat hidupan liar terancam. Apakah pertimbangan PALING penting sebelum projek ini diluluskan?", opts: ["Kesan terhadap alam sekitar dan kepupusan hidupan liar", "Keuntungan syarikat semata-mata", "Bilangan pekerja yang akan diambil", "Lokasi pejabat syarikat"] },
      { type: "kbat", img: "📜⚖️", q: "Perlembagaan Malaysia menetapkan bahawa Islam adalah agama rasmi, tetapi agama-agama lain boleh diamalkan dengan bebas dan aman. Apakah kepentingan peruntukan ini kepada rakyat Malaysia yang berbilang kaum?", opts: ["Menjamin keharmonian beragama dan kebebasan beribadah bagi semua rakyat", "Menghalang rakyat bukan Islam daripada mengamalkan agama mereka", "Mewajibkan semua rakyat memeluk Islam", "Tidak memberi sebarang kesan kepada rakyat"] },
      { type: "kbat", img: "🎓💼", q: "Laporan menunjukkan graduan universiti menghadapi cabaran mendapat pekerjaan kerana kurang kemahiran komunikasi dan kepimpinan. Apakah yang boleh dilakukan oleh pelajar sekolah menengah SEKARANG untuk bersedia menghadapi alam pekerjaan?", opts: ["Sertai aktiviti kokurikulum, asah kemahiran komunikasi, dan cari pengalaman kerja awal", "Fokus sepenuhnya pada peperiksaan akademik sahaja", "Tunggu sehingga masuk universiti baru mula bersiap", "Tidak perlu bersedia kerana pekerjaan mudah didapati"] },
      { type: "kbat", img: "🌊⛵", q: "Seorang nelayan tradisional mendapati hasil tangkapan ikannya semakin berkurangan setiap tahun akibat pencemaran laut dan penangkapan ikan berlebihan. Apakah cadangan yang PALING komprehensif untuk menangani krisis ini?", opts: ["Hadkan kuota tangkapan, kuatkuasakan undang-undang anti pencemaran, dan ajar nelayan kaedah perikanan lestari", "Biarkan nelayan terus menangkap ikan sesuka hati", "Tutup semua industri perikanan", "Larang semua nelayan daripada turun ke laut"] },
      { type: "kbat", img: "🤝🌏", q: "Malaysia kerap menjadi pengantara dalam penyelesaian konflik antara negara-negara jiran. Apakah kelebihan Malaysia dalam memainkan peranan ini?", opts: ["Hubungan diplomatik yang baik, dasar berkecuali, dan kepercayaan pelbagai pihak", "Malaysia adalah negara terkuat di rantau ini", "Malaysia mempunyai tentera yang paling ramai", "Lokasi Malaysia yang sangat jauh dari kawasan konflik"] },
      { type: "kbat", img: "📊🏫", q: "Data menunjukkan kadar keciciran murid sekolah menengah meningkat dalam kalangan keluarga berpendapatan rendah. Apakah dasar pendidikan yang paling berkesan untuk menangani masalah ini?", opts: ["Tingkatkan biasiswa, bina sekolah lebih dekat, dan sediakan sokongan psikologikal", "Naikkan yuran sekolah", "Kurangkan bilangan sekolah", "Hanya buka sekolah di kawasan bandar"] },
      { type: "kbat", img: "🧑‍💻🤖", q: "Revolusi Industri 4.0 membawa perubahan besar kepada dunia pekerjaan, di mana banyak kerja manusia akan digantikan oleh automasi dan kecerdasan buatan. Apakah kemahiran yang PALING penting untuk generasi muda miliki bagi menghadapi perubahan ini?", opts: ["Pemikiran kritis, kreativiti, literasi digital, dan kemahiran menyelesaikan masalah", "Kemahiran menaip dengan pantas", "Kemahiran menghafal fakta", "Kemahiran bermain permainan video"] },
      { type: "kbat", img: "🌱🌍", q: "Matlamat Pembangunan Lestari (SDG) PBB menetapkan sasaran global untuk menangani kemiskinan, kelaparan, dan perubahan iklim menjelang 2030. Apakah sumbangan yang boleh diberikan oleh PELAJAR SEKOLAH dalam mencapai matlamat ini?", opts: ["Amalkan gaya hidup lestari, jimat tenaga dan air, serta sebarkan kesedaran", "Hanya kerajaan dan syarikat besar yang perlu bertindak", "Tunggu sehingga dewasa baru mula menyumbang", "Matlamat SDG tidak berkaitan dengan pelajar sekolah"] },
      { type: "kbat", img: "⚡🔋", q: "Malaysia sedang dalam peralihan kepada penggunaan tenaga boleh diperbaharui. Apakah cabaran utama yang mungkin dihadapi dalam proses peralihan ini?", opts: ["Kos awal yang tinggi, keperluan infrastruktur baharu, dan perubahan tabiat pengguna", "Tiada cabaran langsung kerana tenaga solar mudah diperoleh", "Malaysia tiada matahari yang mencukupi untuk tenaga solar", "Tenaga boleh diperbaharui lebih mahal untuk selamanya"] },
      { type: "kbat", img: "🏛️📜", q: "Sistem demokrasi berparlimen Malaysia memperuntukkan bahawa rakyat memilih wakil mereka melalui pilihan raya. Apakah tanggungjawab RAKYAT dalam sistem ini untuk memastikan ia berfungsi dengan baik?", opts: ["Mengundi secara bijak dan bertanggungjawab, memantau wakil rakyat, dan mengambil tahu isu semasa", "Bergantung sepenuhnya kepada wakil rakyat untuk buat semua keputusan", "Tidak perlu mengundi kerana hasilnya sama sahaja", "Hanya orang dewasa perlu ambil tahu tentang politik"] },
      { type: "kbat", img: "🏥💉", q: "Wabak penyakit baru melanda Malaysia dan kerajaan memperkenalkan program vaksinasi kebangsaan. Namun, segelintir masyarakat enggan divaksin atas pelbagai sebab. Apakah pendekatan TERBAIK untuk menangani keengganan ini?", opts: ["Berikan pendidikan kesihatan yang tepat, libatkan pemimpin komuniti, dan jamin keselamatan vaksin", "Paksa semua orang divaksin tanpa penjelasan", "Abaikan golongan yang enggan divaksin", "Tamatkan program vaksinasi"] },
      { type: "kbat", img: "🏘️🌏", q: "Malaysia berdepan dengan isu pemerdagangan manusia yang serius. Apakah faktor-faktor utama yang menyumbang kepada berleluasanya gejala ini?", opts: ["Kemiskinan, kurang pendidikan, penegakan undang-undang yang lemah, dan permintaan buruh murah", "Kemakmuran ekonomi yang tinggi", "Sistem pendidikan yang cemerlang", "Tiada faktor yang boleh dikenal pasti"] },
      { type: "kbat", img: "📡🛰️", q: "Teknologi komunikasi satelit membolehkan kawasan pedalaman mendapat akses kepada internet berkelajuan tinggi. Apakah manfaat TERBESAR kepada masyarakat luar bandar dengan adanya akses internet ini?", opts: ["Peluang pendidikan yang lebih luas, akses kepada perkhidmatan kesihatan maya, dan pembangunan ekonomi digital", "Hanya untuk hiburan semata-mata", "Menyebabkan lebih banyak masa terbuang", "Tidak memberi sebarang manfaat kepada masyarakat luar bandar"] },
      { type: "kbat", img: "🌾💰", q: "Harga makanan asas seperti beras, minyak masak, dan gula semakin meningkat. Hal ini memberi kesan besar kepada isi rumah berpendapatan rendah. Apakah dasar ekonomi yang PALING berkesan untuk membantu golongan ini?", opts: ["Subsidi makanan yang disasarkan, peningkatan bantuan sosial, dan kawalan harga barangan keperluan", "Naikkan cukai ke atas semua barangan", "Hapuskan semua subsidi makanan", "Biarkan harga ditentukan oleh pasaran semata-mata tanpa sebarang intervensi"] },
      { type: "kbat", img: "🤔💭", q: "Seorang pelajar cemerlang terpaksa memilih antara meneruskan pengajian dalam bidang seni yang diminatinya atau memilih bidang sains yang lebih terjamin masa depannya dari segi kerjaya dan pendapatan. Apakah faktor-faktor yang perlu dipertimbangkan sebelum membuat keputusan ini?", opts: ["Minat, bakat, prospek kerjaya, nilai peribadi, dan sokongan keluarga", "Pendapatan sahaja", "Pilihan rakan sebaya", "Bidang yang paling mudah untuk dipelajari"] },
      { type: "kbat", img: "🌐📱", q: "Media sosial memberi peluang kepada rakyat untuk menyuarakan pandangan secara bebas. Namun, kebebasan ini kadang-kadang disalahgunakan untuk menyebarkan kebencian dan fitnah. Apakah sempadan etika yang perlu dipatuhi dalam menggunakan media sosial?", opts: ["Berkongsi maklumat yang benar dan sahih, hormati maruah orang lain, dan bertanggungjawab terhadap setiap kandungan yang disebarkan", "Boleh menyebarkan apa sahaja asalkan menarik", "Kebebasan bersuara bermaksud tiada had langsung", "Hanya orang dewasa perlu mematuhi etika media sosial"] },
    ],
  },
};

const TAHUN_FOCUS = {
  1: "Kata nama, kata kerja asas, ejaan suku kata, lawan kata",
  2: "Kata adjektif, kata ganti nama diri, imbuhan ber-",
  3: "Kata hubung, kata sendi nama, imbuhan meN-, simpulan bahasa",
  4: "Kata ganda, golongan kata, ayat aktif/pasif, peribahasa",
  5: "Kata majmuk, penjodoh bilangan, ayat majmuk pancangan, perumpamaan",
  6: "Ayat songsang, kata penegas, peribahasa lanjutan, kosa kata formal",
};

const TOPIC_LABEL = {
  "kosa-kata": "Kosa kata",
  "ejaan": "Ejaan",
  "lawan-kata": "Lawan kata",
  "kata-nama": "Kata nama",
  "kata-kerja": "Kata kerja",
  "kata-adjektif": "Kata adjektif",
  "kata-ganti": "Kata ganti nama",
  "kata-hubung": "Kata hubung",
  "kata-sendi": "Kata sendi nama",
  "imbuhan": "Imbuhan",
  "simpulan-bahasa": "Simpulan bahasa",
  "ayat-majmuk": "Ayat majmuk",
  "kata-ganda": "Kata ganda",
  "golongan-kata": "Golongan kata",
  "ayat": "Ayat aktif/pasif",
  "peribahasa": "Peribahasa",
  "kata-majmuk": "Kata majmuk",
  "penjodoh-bilangan": "Penjodoh bilangan",
  "perumpamaan": "Perumpamaan",
  "ayat-songsang": "Ayat songsang",
  "kata-penegas": "Kata penegas",
  "tanda-baca": "Tanda baca",
  "kbat": "KBAT",
};


// ---------- HELPERS ----------
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    if (type === "correct") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.12);
      osc.frequency.setValueAtTime(1047, ctx.currentTime + 0.24);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc.start(); osc.stop(ctx.currentTime + 0.6);
    } else if (type === "wrong") {
      osc.type = "square";
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    } else if (type === "complete") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.12);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.24);
      osc.frequency.setValueAtTime(1047, ctx.currentTime + 0.36);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc.start(); osc.stop(ctx.currentTime + 0.9);
    } else if (type === "start") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    }
  } catch(e) {}
}

const STREAK_MSGS = [
  null,
  null,
  "2 betul berturut-turut! 🔥",
  "3 berturut! Mantap! 🔥🔥",
  "4 berturut! Luar biasa! 🔥🔥🔥",
  "5 berturut! Hebat sangat! 🌟",
  "6 berturut! Juara! 🏆",
  "7 berturut! Cemerlang! 🎊",
];

const CORRECT_MSGS = [
  "Betul! Bagus! 🎉",
  "Tepat sekali! ✨",
  "Pandai! 🌟",
  "Tahniah! 🎊",
  "Benar! Teruskan! 💪",
  "Syabas! 🏅",
  "Wah, bijak! 🤩",
  "100%! 👏",
];

const WRONG_MSGS = [
  "Hampir betul! Cuba lagi 💪",
  "Tidak mengapa, teruskan! 😊",
  "Jangan berputus asa! 🌈",
  "Ulang kaji ya! 📚",
  "Lain kali pasti boleh! ✊",
];

// ---------- COMPONENTS ----------
function Wau({ size = 56, bounce = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true"
      style={{ animation: bounce ? "mascotBounce 0.5s ease" : "none" }}>
      <polygon points="50,6 90,50 50,94 10,50" fill={COLORS.sun} stroke={COLORS.sunDark} strokeWidth="3" />
      <polygon points="50,6 70,50 50,94 30,50" fill={COLORS.hibiscus} opacity="0.85" />
      <circle cx="50" cy="50" r="8" fill={COLORS.cream} stroke={COLORS.sunDark} strokeWidth="2" />
    </svg>
  );
}

function Mascot({ mood }) {
  const face = mood === "happy" ? "🤩" : mood === "wrong" ? "😅" : mood === "celebrate" ? "🥳" : "😊";
  const anim = mood === "happy" ? "mascotBounce 0.5s ease" : mood === "wrong" ? "mascotShake 0.4s ease" : mood === "celebrate" ? "mascotBounce 0.6s ease 3" : "none";
  return <div style={{ fontSize: "48px", lineHeight: 1, animation: anim, display: "inline-block" }}>{face}</div>;
}

function Confetti({ active }) {
  const colors = [COLORS.sun, COLORS.hibiscus, COLORS.sky, COLORS.leaf, "#9B59B6", "#FF6B35", "#FFD700"];
  if (!active) return null;
  const pieces = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: Math.random() * 100,
    delay: Math.random() * 1.2,
    size: 7 + Math.random() * 9,
    isCircle: Math.random() > 0.5,
    dur: 1.4 + Math.random() * 0.8,
  }));
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 999, overflow: "hidden" }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: "absolute", top: "-20px", left: `${p.left}%`,
          width: `${p.size}px`, height: `${p.size}px`,
          background: p.color, borderRadius: p.isCircle ? "50%" : "2px",
          animation: `confettiFall ${p.dur}s ease-in ${p.delay}s forwards`,
        }} />
      ))}
    </div>
  );
}

function FeedbackToast({ msg, show }) {
  if (!show || !msg) return null;
  return (
    <div style={{
      position: "fixed", top: "80px", left: "50%", transform: "translateX(-50%)",
      background: "white", border: `2px solid ${COLORS.sun}`,
      borderRadius: "20px", padding: "10px 22px",
      fontSize: "15px", fontWeight: 700, color: COLORS.ink,
      boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
      animation: "toastPop 0.3s ease",
      zIndex: 998, whiteSpace: "nowrap",
    }}>
      {msg}
    </div>
  );
}

function Stars({ score, total }) {
  const pct = score / total;
  const count = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.5 ? 1 : 0;
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "8px", margin: "12px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          fontSize: "36px", lineHeight: 1,
          animation: i < count ? `starSpin 0.4s ease ${i * 0.15}s both` : "none",
          opacity: i < count ? 1 : 0.2,
        }}>⭐</div>
      ))}
    </div>
  );
}

function XPBadge({ xp, animate }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      background: "#FFF3CD", border: `1.5px solid ${COLORS.sun}`,
      borderRadius: "999px", padding: "3px 10px",
      fontSize: "13px", fontWeight: 700, color: COLORS.sunDark,
      animation: animate ? "xpPop 0.35s ease" : "none",
    }}>
      ⚡ {xp} XP
    </div>
  );
}

// ---------- DUITNOW MODAL ----------
// ⚠️  ARAHAN: Gantikan elemen <img> di bawah dengan gambar QR DuitNow anda.
//    Contoh: <img src="duitnow-qr.png" width="200" height="200" style={{borderRadius:8}} />
//    Atau host QR image anda dan guna URL terus.

function DuitNowModal({ onClose }) {
  const amounts = ["RM3", "RM5", "RM10", "RM20"];
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: "20px",
        padding: "28px 24px", maxWidth: "340px", width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        animation: "toastPop 0.3s ease",
        textAlign: "center",
        position: "relative",
      }}>
        {/* Close button */}
        <button onClick={onClose} style={{
          position: "absolute", top: "12px", right: "14px",
          background: "none", border: "none", fontSize: "20px",
          cursor: "pointer", color: "#aaa", lineHeight: 1,
        }}>✕</button>

        {/* DuitNow branding strip */}
        <div style={{
          background: "linear-gradient(135deg, #E31837, #C0102C)",
          borderRadius: "12px", padding: "10px 16px", marginBottom: "18px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
        }}>
          <div style={{ fontSize: "28px" }}>💳</div>
          <div>
            <div style={{ color: "white", fontWeight: 800, fontSize: "18px", letterSpacing: 0.5 }}>DuitNow</div>
            <div style={{ color: "#FFB3B3", fontSize: "11px" }}>Scan & bayar dengan mudah</div>
          </div>
        </div>

        <div style={{ fontSize: "17px", fontWeight: 700, color: "#2B2B26", marginBottom: "4px" }}>
          ☕ Sokong Kelas BM Ini
        </div>
        <div style={{ fontSize: "13px", color: "#666", marginBottom: "18px", lineHeight: 1.5 }}>
          App ini percuma untuk semua murid. Jika anda rasa ia bermanfaat, sokongan anda sangat kami hargai! 🙏
        </div>

        {/* QR Code area — replace the image file at public/duitnow-qr.png with your QR image */}
        <div style={{
          width: "220px", height: "220px", margin: "0 auto 18px",
          borderRadius: "18px", overflow: "hidden",
          background: "#FFF5F5", display: "flex", alignItems: "center", justifyContent: "center",
          border: "2px solid #E31837",
        }}>
          <img
            src="/duitnow-qr.png"
            alt="DuitNow QR Code"
            width="196"
            height="196"
            style={{ borderRadius: 12, objectFit: "cover" }}
          />
        </div>

        {/* Suggested amounts */}
        <div style={{ fontSize: "12px", color: "#888", marginBottom: "8px" }}>Cadangan amaun:</div>
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "20px" }}>
          {amounts.map(a => (
            <div key={a} style={{
              background: "#FFF0F0", border: "1.5px solid #E31837",
              borderRadius: "8px", padding: "5px 10px",
              fontSize: "13px", fontWeight: 700, color: "#C0102C",
            }}>{a}</div>
          ))}
        </div>

        <div style={{ fontSize: "12px", color: "#999", marginBottom: "16px" }}>
          Scan dengan mana-mana app bank atau e-wallet anda 🏦
        </div>

        <button onClick={onClose} style={{
          background: "none", border: "none", color: "#aaa",
          fontSize: "13px", cursor: "pointer", textDecoration: "underline",
        }}>
          Tidak mengapa, terima kasih
        </button>
      </div>
    </div>
  );
}

// ---------- MAIN APP ----------
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [tahun, setTahun] = useState(1);
  const [setKey, setSetKey] = useState("A");
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [xpAnim, setXpAnim] = useState(false);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [mascotMood, setMascotMood] = useState("neutral");
  const [toast, setToast] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [attemptSeed, setAttemptSeed] = useState(0);
  const [progress, setProgress] = useState({});
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const toastTimer = useRef(null);
  const [showDuitNow, setShowDuitNow] = useState(false);
  const duitNowTimer = useRef(null);

  const storageGet = async key => {
    if (typeof window !== "undefined" && window.storage) {
      try {
        const res = await window.storage.get(key, false);
        return res && res.value ? JSON.parse(res.value) : null;
      } catch (e) {
        return null;
      }
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  };

  const storageSet = async (key, value) => {
    const payload = JSON.stringify(value);
    if (typeof window !== "undefined" && window.storage) {
      try {
        await window.storage.set(key, payload, false);
        return;
      } catch (e) {
        // fallback to localStorage
      }
    }
    try {
      window.localStorage.setItem(key, payload);
    } catch (e) {
      // ignore write errors
    }
  };

  // Inject CSS keyframes once
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes mascotBounce { 0%,100%{transform:translateY(0) scale(1)} 40%{transform:translateY(-12px) scale(1.1)} 70%{transform:translateY(-4px)} }
      @keyframes mascotShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
      @keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg) scale(1);opacity:1} 100%{transform:translateY(520px) rotate(720deg) scale(0.5);opacity:0} }
      @keyframes toastPop { 0%{transform:translateX(-50%) translateY(-10px) scale(0.8);opacity:0} 100%{transform:translateX(-50%) translateY(0) scale(1);opacity:1} }
      @keyframes starSpin { 0%{transform:scale(0) rotate(-180deg);opacity:0} 70%{transform:scale(1.3) rotate(10deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
      @keyframes xpPop { 0%{transform:scale(1)} 40%{transform:scale(1.25)} 100%{transform:scale(1)} }
      @keyframes streakPop { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
      @keyframes cardSlide { 0%{transform:translateX(30px);opacity:0} 100%{transform:translateX(0);opacity:1} }
      @keyframes correctPulse { 0%{box-shadow:0 0 0 0 rgba(92,138,58,0.5)} 70%{box-shadow:0 0 0 10px rgba(92,138,58,0)} 100%{box-shadow:0 0 0 0 rgba(92,138,58,0)} }
      @keyframes splashPulse { 0%,100%{transform:scale(0.96);opacity:0.8} 50%{transform:scale(1.05);opacity:1} }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    async function loadProgress() {
      const next = {};
      for (const lv of [1, 2, 3, 4, 5, 6]) {
        for (const set of ["A", "B", "C"]) {
          const key = `progress:D${lv}-${set}`;
          const record = await storageGet(key);
          if (record) next[key] = record;
        }
      }
      setProgress(next);
      setProgressLoaded(true);
    }
    loadProgress();
  }, []);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      if (screen === "splash") setScreen("home");
    }, 1400);
    return () => clearTimeout(splashTimer);
  }, [screen]);

  // Random DuitNow popup timer (3–7 min intervals, not during active answering)
  useEffect(() => {
    function scheduleNext() {
      const delay = (3 + Math.random() * 4) * 60 * 1000; // 3–7 minutes
      duitNowTimer.current = setTimeout(() => {
        setShowDuitNow(prev => {
          if (!prev) return true; // only show if not already open
          return prev;
        });
      }, delay);
    }
    scheduleNext();
    return () => clearTimeout(duitNowTimer.current);
  }, []);

  function dismissDuitNow() {
    setShowDuitNow(false);
    clearTimeout(duitNowTimer.current);
    // Schedule next popup in 3–7 more minutes
    const delay = (3 + Math.random() * 4) * 60 * 1000;
    duitNowTimer.current = setTimeout(() => setShowDuitNow(true), delay);
  }

  const questions = useMemo(() => {
    return shuffle(BANK[tahun][setKey]).map(q => {
      const indexed = q.opts.map((opt, i) => ({ opt, isCorrect: i === 0 }));
      const shuffled = shuffle(indexed);
      return { ...q, opts: shuffled.map(x => x.opt), a: shuffled.findIndex(x => x.isCorrect) };
    });
  }, [tahun, setKey, attemptSeed]);

  const current = questions[qIndex];

  function showToastMsg(msg) {
    clearTimeout(toastTimer.current);
    setToast(msg);
    setShowToast(true);
    toastTimer.current = setTimeout(() => setShowToast(false), 2000);
  }

  function startQuiz(level, set) {
    playSound("start");
    setTahun(level);
    setSelectedYear(level);
    setSetKey(set);
    setQIndex(0);
    setScore(0);
    setXp(0);
    setSelected(null);
    setLocked(false);
    setHistory([]);
    setStreak(0);
    setBestStreak(0);
    setMascotMood("neutral");
    setConfetti(false);
    setAttemptSeed(s => s + 1);
    setSessionActive(true);
    setScreen("quiz");
  }

  function choose(i) {
    if (locked) return;
    setSelected(i);
    setLocked(true);
    const correct = i === current.a;
    if (correct) {
      const newStreak = streak + 1;
      const newScore = score + 1;
      const earned = 10 + Math.max(0, (newStreak - 1) * 5);
      setStreak(newStreak);
      setBestStreak(bs => Math.max(bs, newStreak));
      setScore(newScore);
      setXp(x => x + earned);
      setXpAnim(true);
      setTimeout(() => setXpAnim(false), 500);
      setMascotMood("happy");
      playSound("correct");
      const msg = newStreak >= 2 && STREAK_MSGS[Math.min(newStreak, STREAK_MSGS.length - 1)]
        ? STREAK_MSGS[Math.min(newStreak, STREAK_MSGS.length - 1)]
        : CORRECT_MSGS[Math.floor(Math.random() * CORRECT_MSGS.length)];
      showToastMsg(msg);
    } else {
      setStreak(0);
      setMascotMood("wrong");
      playSound("wrong");
      showToastMsg(WRONG_MSGS[Math.floor(Math.random() * WRONG_MSGS.length)]);
    }
    setHistory(h => [...h, { q: current.q, correct }]);
  }

  function next() {
    setMascotMood("neutral");
    if (qIndex + 1 < questions.length) {
      setQIndex(i => i + 1);
      setSelected(null);
      setLocked(false);
    } else {
      finishQuiz();
    }
  }

  async function finishQuiz() {
    playSound("complete");
    if (score / questions.length >= 0.6) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
    }
    setMascotMood("celebrate");
    const key = `progress:D${tahun}-${setKey}`;
    const prior = progress[key];
    const record = {
      bestScore: prior ? Math.max(prior.bestScore, score) : score,
      total: questions.length,
      attempts: prior ? prior.attempts + 1 : 1,
      lastScore: score,
      lastPlayed: new Date().toISOString(),
    };
    setProgress(p => ({ ...p, [key]: record }));
    await storageSet(key, record);
    setSessionActive(false);
    setScreen("result");
  }

  const pct = questions.length ? (qIndex + (locked ? 1 : 0)) / questions.length : 0;
  const progressColor = pct < 0.4 ? COLORS.hibiscus : pct < 0.7 ? COLORS.sun : COLORS.leaf;

  return (
    <>
      <Analytics />
      <div style={{ minHeight: "560px", background: COLORS.cream, fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", color: COLORS.ink, borderRadius: "16px", overflow: "hidden" }}>
        <Confetti active={confetti} />
        {showDuitNow && <DuitNowModal onClose={dismissDuitNow} />}
        <FeedbackToast msg={toast} show={showToast} />

      {/* HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.skyDark}, ${COLORS.sky})`, padding: "18px 22px", display: "flex", alignItems: "center", gap: "14px" }}>
        <Wau size={44} />
        <div style={{ flex: 1 }}>
          <div style={{ color: "white", fontSize: "20px", fontWeight: 700, lineHeight: 1.1 }}>Kelas Bahasa Melayu</div>
          <div style={{ color: "#B3D9EE", fontSize: "12px" }}>Latihan interaktif Tahun 1–6 · KSSR</div>
        </div>
        {screen === "quiz" && <XPBadge xp={xp} animate={xpAnim} />}
        <button
          onClick={() => setShowDuitNow(true)}
          title="Sokong kami"
          style={{
            background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.4)",
            borderRadius: "10px", padding: "7px 11px", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "1px", color: "white", fontFamily: "inherit",
          }}>
          <span style={{ fontSize: "18px", lineHeight: 1 }}>☕</span>
          <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: 0.3 }}>SOKONG</span>
        </button>
      </div>

      <div style={{ padding: "20px" }}>

        {/* SPLASH SCREEN */}
        {screen === "splash" && (
          <div style={{ minHeight: "320px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: "18px", color: COLORS.skyDark }}>
            <div style={{ fontSize: "54px", lineHeight: 1 }}>📚</div>
            <div style={{ fontSize: "26px", fontWeight: 800 }}>Selamat Datang ke Kelas BM</div>
            <div style={{ maxWidth: "360px", fontSize: "14px", color: COLORS.ink, lineHeight: 1.7 }}>
              Latihan interaktif Tahun 1–6. Pilih tahun dan set untuk mula berlatih.
            </div>
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", border: `4px solid ${COLORS.sky}`, display: "flex", justifyContent: "center", alignItems: "center", animation: "splashPulse 1.3s ease-in-out infinite" }}>
              <span style={{ fontSize: "24px" }}>⏳</span>
            </div>
          </div>
        )}

        {/* HOME SCREEN */}
        {screen === "home" && !selectedYear && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div style={{ fontSize: "40px" }}>🏆</div>
              <p style={{ fontSize: "15px", color: COLORS.ink, margin: "6px 0" }}>
                Pilih tahun latihan dahulu. Setelah itu, pilih set soalan untuk Tahun tersebut.
              </p>
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              {[1, 2, 3, 4, 5, 6].map(lv => (
                <button key={lv} onClick={() => setSelectedYear(lv)}
                  style={{
                    width: "100%", textAlign: "left", padding: "18px 16px",
                    background: "white", border: `2px solid ${COLORS.sky}`, borderRadius: "14px",
                    cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: COLORS.skyDark }}>Tahun {lv}</div>
                  <div style={{ fontSize: "12px", color: COLORS.ink, opacity: 0.8, marginTop: "6px" }}>{TAHUN_FOCUS[lv]}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {screen === "home" && selectedYear !== null && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <button onClick={() => setSelectedYear(null)}
                style={{
                  background: "none", border: "none", color: COLORS.skyDark,
                  cursor: "pointer", fontSize: "14px", fontWeight: 700,
                }}>
                ← Pilih Tahun Lain
              </button>
              <div style={{ fontSize: "14px", fontWeight: 700, color: COLORS.skyDark }}>Tahun {selectedYear}</div>
            </div>
            <div style={{ fontSize: "12px", color: COLORS.skyDark, background: "#E3F2FA", borderRadius: "10px", padding: "10px 14px", marginBottom: "14px", textAlign: "center" }}>
              Pilih salah satu set untuk Tahun {selectedYear}.
            </div>
            <div style={{ display: "grid", gap: "10px" }}>
              {[
                { set: "A", label: "Set A", emoji: "📘", bg: COLORS.sky, color: "white" },
                { set: "B", label: "Set B", emoji: "📙", bg: COLORS.sun, color: COLORS.sunDark },
                { set: "C", label: "KBAT", emoji: "🧠", bg: COLORS.hibiscus, color: "white" },
              ].map(s => {
                const rec = progress[`progress:D${selectedYear}-${s.set}`];
                const perfect = rec && rec.bestScore === rec.total;
                const isCurrentSession = sessionActive && selectedYear === tahun && s.set === setKey;
                return (
                  <button key={s.set} onClick={() => {
                    if (isCurrentSession) {
                      setScreen("quiz");
                    } else {
                      startQuiz(selectedYear, s.set);
                    }
                  }}
                    style={{
                      width: "100%", padding: "16px 14px", display: "flex", justifyContent: "space-between",
                      alignItems: "center", borderRadius: "14px", background: s.bg, color: s.color,
                      border: isCurrentSession ? `2px solid ${COLORS.ink}` : "none",
                      cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "15px", fontWeight: 700 }}>{s.label}</div>
                      <div style={{ fontSize: "12px", opacity: 0.9 }}>{rec ? `${rec.bestScore}/${rec.total} terbaik` : "Belum dicuba"}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                      <div style={{ fontSize: "24px" }}>{s.emoji}</div>
                      {isCurrentSession && <div style={{ fontSize: "12px", fontWeight: 700 }}>Teruskan</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* QUIZ SCREEN */}
        {screen === "quiz" && current && (
          <div>
            {/* Back button + topic header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <button onClick={() => setScreen("home")}
                style={{
                  background: "rgba(255,255,255,0.95)", border: `1px solid ${COLORS.skyDark}`,
                  color: COLORS.skyDark, borderRadius: "10px", padding: "8px 12px",
                  cursor: "pointer", fontFamily: "inherit", fontWeight: 700,
                }}>
                ← Kembali
              </button>
              <div style={{ fontSize: "12px", color: COLORS.ink, fontWeight: 700 }}>
                Tahun {tahun} · Set {setKey}
              </div>
            </div>
            {/* Top bar: topic badge + mascot + streak */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{
                fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px",
                color: current.type === "kbat" ? COLORS.hibiscusDark : COLORS.leafDark,
                background: current.type === "kbat" ? "#FCEBEB" : "#EAF3DE",
              }}>
                {TOPIC_LABEL[current.type]}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {streak >= 2 && (
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#E67E22", animation: "streakPop 0.3s ease" }}>
                    🔥 {streak}
                  </span>
                )}
                <span style={{ fontSize: "12px", color: COLORS.ink }}>{qIndex + 1}/{questions.length}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: "8px", background: "#E5E0CF", borderRadius: "999px", marginBottom: "14px", overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${pct * 100}%`, background: progressColor,
                borderRadius: "999px", transition: "width 0.4s ease, background 0.5s ease",
              }} />
            </div>

            {/* Mascot row */}
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <Mascot mood={mascotMood} />
            </div>

            {/* Image */}
            {current.img && (
              <div style={{
                fontSize: "42px", textAlign: "center", background: "#F5F1E2",
                borderRadius: "14px", padding: "14px", marginBottom: "14px", lineHeight: 1,
                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.06)",
              }} aria-hidden="true">
                {current.img}
              </div>
            )}

            {/* Question */}
            <div style={{
              fontSize: "15px", fontWeight: 700, marginBottom: "14px", lineHeight: 1.6,
              animation: "cardSlide 0.3s ease",
            }}>
              {current.q}
            </div>

            {/* Options */}
            <div style={{ display: "grid", gap: "8px" }}>
              {current.opts.map((opt, i) => {
                const isCorrect = locked && i === current.a;
                const isWrong = locked && i === selected && i !== current.a;
                return (
                  <button key={i} onClick={() => choose(i)} disabled={locked}
                    style={{
                      textAlign: "left", padding: "12px 16px", borderRadius: "12px",
                      border: `2px solid ${isCorrect ? COLORS.leaf : isWrong ? COLORS.hibiscus : locked && i === current.a ? COLORS.leaf : "#D8D2BE"}`,
                      background: isCorrect ? "#EAF3DE" : isWrong ? "#FCEBEB" : "white",
                      color: isCorrect ? COLORS.leafDark : isWrong ? COLORS.hibiscusDark : COLORS.ink,
                      fontSize: "14px", lineHeight: 1.4, cursor: locked ? "default" : "pointer",
                      fontFamily: "inherit",
                      animation: isCorrect ? "correctPulse 0.5s ease" : isWrong ? "mascotShake 0.4s ease" : "none",
                      transition: "background 0.2s, border-color 0.2s",
                      display: "flex", alignItems: "center", gap: "10px",
                    }}>
                    <span style={{
                      width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                      background: isCorrect ? COLORS.leaf : isWrong ? COLORS.hibiscus : "#E5E0CF",
                      color: (isCorrect || isWrong) ? "white" : COLORS.ink,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: 700,
                    }}>
                      {isCorrect ? "✓" : isWrong ? "✗" : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Bottom: score + next */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
              <div style={{ fontSize: "13px", color: COLORS.ink }}>
                ✅ {score} betul &nbsp;|&nbsp; 💬 {qIndex + 1 - score} salah
              </div>
              <button onClick={next} disabled={!locked}
                style={{
                  background: locked ? `linear-gradient(135deg, ${COLORS.sky}, ${COLORS.skyDark})` : "#D8D2BE",
                  color: "white", border: "none", borderRadius: "12px",
                  padding: "10px 24px", fontWeight: 700, cursor: locked ? "pointer" : "default",
                  fontFamily: "inherit", fontSize: "14px",
                  boxShadow: locked ? "0 3px 8px rgba(31,90,115,0.3)" : "none",
                  transition: "all 0.2s",
                }}>
                {qIndex + 1 < questions.length ? "Seterusnya →" : "Selesai! 🎉"}
              </button>
            </div>
          </div>
        )}

        {/* RESULT SCREEN */}
        {screen === "result" && (
          <div style={{ textAlign: "center" }}>
            <Mascot mood="celebrate" />
            <Stars score={score} total={questions.length} />
            <div style={{ fontSize: "32px", fontWeight: 700, color: COLORS.skyDark }}>
              {score} / {questions.length}
            </div>
            <div style={{ fontSize: "14px", color: COLORS.ink, marginTop: "4px", marginBottom: "8px" }}>
              {score === questions.length ? "Sempurna! Kamu CEMERLANG! 🏆" :
               score / questions.length >= 0.8 ? "Tahniah! Prestasi yang sangat baik! 🎊" :
               score / questions.length >= 0.6 ? "Bagus! Teruskan berlatih! 💪" :
               "Jangan berputus asa, cuba lagi! 🌈"}
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "14px", flexWrap: "wrap" }}>
              <div style={{ background: "#EAF3DE", borderRadius: "10px", padding: "8px 14px" }}>
                <div style={{ fontSize: "11px", color: COLORS.leafDark }}>XP Dikumpul</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: COLORS.leafDark }}>⚡ {xp}</div>
              </div>
              <div style={{ background: "#FFF3CD", borderRadius: "10px", padding: "8px 14px" }}>
                <div style={{ fontSize: "11px", color: COLORS.sunDark }}>Streak Terbaik</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: COLORS.sunDark }}>🔥 {bestStreak}</div>
              </div>
              <div style={{ background: "#E3F2FA", borderRadius: "10px", padding: "8px 14px" }}>
                <div style={{ fontSize: "11px", color: COLORS.skyDark }}>Ketepatan</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: COLORS.skyDark }}>{Math.round(score/questions.length*100)}%</div>
              </div>
            </div>

            {/* History - scrollable */}
            <div style={{ textAlign: "left", background: "white", borderRadius: "12px", padding: "10px 14px", border: "1px solid #E5E0CF", maxHeight: "190px", overflowY: "auto" }}>
              {history.map((h, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "5px 0", borderBottom: i < history.length - 1 ? "1px solid #F0EBDD" : "none", gap: "8px" }}>
                  <span style={{ color: COLORS.ink, flex: 1 }}>{h.q.length > 55 ? h.q.slice(0, 55) + "…" : h.q}</span>
                  <span style={{ color: h.correct ? COLORS.leafDark : COLORS.hibiscusDark, fontWeight: 700, flexShrink: 0 }}>{h.correct ? "✓" : "✗"}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "center" }}>
              <button onClick={() => startQuiz(tahun, setKey)}
                style={{ background: `linear-gradient(135deg, ${COLORS.sun}, #E8941A)`, color: "white", border: "none", borderRadius: "12px", padding: "11px 20px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 3px 8px rgba(242,169,59,0.4)" }}>
                🔄 Cuba lagi
              </button>
              <button onClick={() => setScreen("home")}
                style={{ background: "white", color: COLORS.skyDark, border: `2px solid ${COLORS.sky}`, borderRadius: "12px", padding: "11px 20px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                🏠 Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
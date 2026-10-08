# Scavenger Reign - 2. Sezon (hayran projesi)

Bu repo, iptal edilen Scavenger Reign animasyon dizisi için hayran yapımı bir 2. sezon çalışmasıdır.

- Kullanıcıyla Türkçe konuş. Çalışma belgeleri (senaryo, notlar) Türkçe; dizinin diyalogları ve seslendirmesi **İngilizce** (replikler İngilizce + Türkçe anlam olarak yazılır).
- İki agent var:
  - `animasyon-yonetmeni` (`.claude/agents/animasyon-yonetmeni.md`): proje yönetimi, hikâye, karakter, kanon araştırması, aşama kontrolü, yaratıcı onay.
  - `animasyon-uretim` (`.claude/agents/animasyon-uretim.md`): araç ve yapay zekâ seçimi, pipeline, prompt, üretim kalite kontrolü.
- Agent'lar birbirini doğrudan çağıramaz. `proje/iletisim/TALEPLER.md` dosyası üzerinden haberleşirler. Bir agent yanıtında "Üretime iletilmeli" ya da "Yönetmene iletilmeli" derse, ilgili agent'ı o talep için çağır.
- Projenin güncel durumu `proje/DURUM.md`, kaynaklar `proje/KAYNAKLAR.md` dosyasındadır.

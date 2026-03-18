const BASE = "https://images.xhbtr.com/v2/uploads/images";

export interface NoteImage {
  id: string;
  src: string;
  srcLarge: string;
  aspectRatio: number;
  year: string;
}

export const notesImages: NoteImage[] = [
  // Notes I — 1989–2015
  { id: "236083", src: `${BASE}/236083/xhbtr_f092021c-bf53-4d50-89d9-d8eefdca6711_w1200.jpg`, srcLarge: `${BASE}/236083/xhbtr_f092021c-bf53-4d50-89d9-d8eefdca6711_w1600.jpg`, aspectRatio: 1.442, year: "1989–2015" },
  { id: "236086", src: `${BASE}/236086/xhbtr_5d793d53-1e44-467b-9423-514a8b1ea537_w1200.jpg`, srcLarge: `${BASE}/236086/xhbtr_5d793d53-1e44-467b-9423-514a8b1ea537_w1600.jpg`, aspectRatio: 0.689, year: "1989–2015" },
  { id: "196426", src: `${BASE}/196426/xhbtr_925901c5-3696-4222-8e20-08ce88ee3402_w1200.jpg`, srcLarge: `${BASE}/196426/xhbtr_925901c5-3696-4222-8e20-08ce88ee3402_w1600.jpg`, aspectRatio: 1.494, year: "1989–2015" },
  { id: "236080", src: `${BASE}/236080/xhbtr_9f58bb47-b0f1-4f76-99fd-1b93016a98e6_w1200.jpg`, srcLarge: `${BASE}/236080/xhbtr_9f58bb47-b0f1-4f76-99fd-1b93016a98e6_w1600.jpg`, aspectRatio: 1.476, year: "1989–2015" },
  { id: "236085", src: `${BASE}/236085/xhbtr_574faa0a-eac6-4463-ad24-ae1d23d58701_w1200.jpg`, srcLarge: `${BASE}/236085/xhbtr_574faa0a-eac6-4463-ad24-ae1d23d58701_w1600.jpg`, aspectRatio: 0.679, year: "1989–2015" },
  { id: "236081", src: `${BASE}/236081/xhbtr_3b839e30-1b8c-4aab-837d-9f24a869911e_w1200.jpg`, srcLarge: `${BASE}/236081/xhbtr_3b839e30-1b8c-4aab-837d-9f24a869911e_w1600.jpg`, aspectRatio: 0.676, year: "1989–2015" },

  // Notes II — 2016–2017
  { id: "319595", src: `${BASE}/319595/xhbtr_d30ef6ad-8fd8-4a96-b87f-55ca329a10cc_w1200.jpg`, srcLarge: `${BASE}/319595/xhbtr_d30ef6ad-8fd8-4a96-b87f-55ca329a10cc_w1600.jpg`, aspectRatio: 0.675, year: "2016" },
  { id: "319592", src: `${BASE}/319592/xhbtr_88d00dad-7456-4529-ac12-f154618dc7e5_w1200.jpg`, srcLarge: `${BASE}/319592/xhbtr_88d00dad-7456-4529-ac12-f154618dc7e5_w1600.jpg`, aspectRatio: 1.480, year: "2016" },
  { id: "236529", src: `${BASE}/236529/xhbtr_36c3e8f9-3cd4-4330-84ed-a634f2085c9a_w1200.jpg`, srcLarge: `${BASE}/236529/xhbtr_36c3e8f9-3cd4-4330-84ed-a634f2085c9a_w1600.jpg`, aspectRatio: 0.673, year: "2016" },
  { id: "236528", src: `${BASE}/236528/xhbtr_dec270ba-5da5-43d6-a52d-1e75ec44c087_w1200.jpg`, srcLarge: `${BASE}/236528/xhbtr_dec270ba-5da5-43d6-a52d-1e75ec44c087_w1600.jpg`, aspectRatio: 1.478, year: "2016" },
  { id: "236560", src: `${BASE}/236560/xhbtr_ae2a4380-eceb-4f3d-8fc2-58e98b07c855_w1200.jpg`, srcLarge: `${BASE}/236560/xhbtr_ae2a4380-eceb-4f3d-8fc2-58e98b07c855_w1600.jpg`, aspectRatio: 0.657, year: "2017" },
  { id: "236527", src: `${BASE}/236527/xhbtr_288982f7-db05-453f-8927-f19c4e58cb01_w1200.jpg`, srcLarge: `${BASE}/236527/xhbtr_288982f7-db05-453f-8927-f19c4e58cb01_w1600.jpg`, aspectRatio: 1.491, year: "2017" },
  { id: "319593", src: `${BASE}/319593/xhbtr_6be7ca77-198c-4741-aa12-0b94800e03a5_w1200.jpg`, srcLarge: `${BASE}/319593/xhbtr_6be7ca77-198c-4741-aa12-0b94800e03a5_w1600.jpg`, aspectRatio: 0.675, year: "2017" },
  { id: "319594", src: `${BASE}/319594/xhbtr_aa981041-5d79-41b0-9e7f-0453dd9b8f21_w1200.jpg`, srcLarge: `${BASE}/319594/xhbtr_aa981041-5d79-41b0-9e7f-0453dd9b8f21_w1600.jpg`, aspectRatio: 0.675, year: "2017" },
  { id: "319591", src: `${BASE}/319591/xhbtr_d0a281a6-9d0f-44c4-b941-365d174c3a5a_w1200.jpg`, srcLarge: `${BASE}/319591/xhbtr_d0a281a6-9d0f-44c4-b941-365d174c3a5a_w1600.jpg`, aspectRatio: 0.675, year: "2017" },
  { id: "319597", src: `${BASE}/319597/xhbtr_fc6cd858-0aaa-443b-8ad7-7044ec631848_w1200.jpg`, srcLarge: `${BASE}/319597/xhbtr_fc6cd858-0aaa-443b-8ad7-7044ec631848_w1600.jpg`, aspectRatio: 1.490, year: "2017" },
  { id: "319599", src: `${BASE}/319599/xhbtr_402641db-2dc3-43cd-8680-5ce57ab500ec_w1200.jpg`, srcLarge: `${BASE}/319599/xhbtr_402641db-2dc3-43cd-8680-5ce57ab500ec_w1600.jpg`, aspectRatio: 0.671, year: "2017" },
  { id: "319602", src: `${BASE}/319602/xhbtr_a76fd95b-7213-486e-bb2f-f2aebbb05671_w1200.jpg`, srcLarge: `${BASE}/319602/xhbtr_a76fd95b-7213-486e-bb2f-f2aebbb05671_w1600.jpg`, aspectRatio: 0.671, year: "2017" },
  { id: "319600", src: `${BASE}/319600/xhbtr_9a192b6f-b414-45c4-b9a5-0250ecc01974_w1200.jpg`, srcLarge: `${BASE}/319600/xhbtr_9a192b6f-b414-45c4-b9a5-0250ecc01974_w1600.jpg`, aspectRatio: 1.480, year: "2017" },
  { id: "319598", src: `${BASE}/319598/xhbtr_ff273ddb-adc8-4f66-8445-c3ce080d36bc_w1200.jpg`, srcLarge: `${BASE}/319598/xhbtr_ff273ddb-adc8-4f66-8445-c3ce080d36bc_w1600.jpg`, aspectRatio: 1.480, year: "2017" },
  { id: "319601", src: `${BASE}/319601/xhbtr_a0adc3be-41cb-49d7-acb0-fe43f1c4b9a9_w1200.jpg`, srcLarge: `${BASE}/319601/xhbtr_a0adc3be-41cb-49d7-acb0-fe43f1c4b9a9_w1600.jpg`, aspectRatio: 1.491, year: "2017" },

  // Notes III — 2018
  { id: "236561", src: `${BASE}/236561/xhbtr_bba4dca6-2c31-4334-8abe-93ca1f1d1dd4_w1200.jpg`, srcLarge: `${BASE}/236561/xhbtr_bba4dca6-2c31-4334-8abe-93ca1f1d1dd4_w1600.jpg`, aspectRatio: 0.654, year: "2018" },
  { id: "196429", src: `${BASE}/196429/xhbtr_2dd33e38-3534-4eaf-bfd0-5bdefa828b17_w1200.jpg`, srcLarge: `${BASE}/196429/xhbtr_2dd33e38-3534-4eaf-bfd0-5bdefa828b17_w1600.jpg`, aspectRatio: 0.664, year: "2018" },
  { id: "305926", src: `${BASE}/305926/xhbtr_26a7f6e0-efd9-4fb8-98c9-babb600e39eb_w1200.jpg`, srcLarge: `${BASE}/305926/xhbtr_26a7f6e0-efd9-4fb8-98c9-babb600e39eb_w1600.jpg`, aspectRatio: 0.812, year: "2018" },
  { id: "305943", src: `${BASE}/305943/xhbtr_14afbdbd-db45-44f8-8f64-e8c82f2e2a56_w1200.jpg`, srcLarge: `${BASE}/305943/xhbtr_14afbdbd-db45-44f8-8f64-e8c82f2e2a56_w1600.jpg`, aspectRatio: 1.243, year: "2018" },
  { id: "236544", src: `${BASE}/236544/xhbtr_fd2c8f40-8bc8-4aaf-bdd8-c1f92b408b9e_w1200.jpg`, srcLarge: `${BASE}/236544/xhbtr_fd2c8f40-8bc8-4aaf-bdd8-c1f92b408b9e_w1600.jpg`, aspectRatio: 1.269, year: "2018" },
  { id: "236545", src: `${BASE}/236545/xhbtr_50b36375-5710-4f05-8d12-b0f6e2e8104b_w1200.jpg`, srcLarge: `${BASE}/236545/xhbtr_50b36375-5710-4f05-8d12-b0f6e2e8104b_w1600.jpg`, aspectRatio: 1.193, year: "2018" },

  // Notes III — 2019
  { id: "305939", src: `${BASE}/305939/xhbtr_746bb624-8cc9-4a08-8925-f18c04168ae8_w1200.jpg`, srcLarge: `${BASE}/305939/xhbtr_746bb624-8cc9-4a08-8925-f18c04168ae8_w1600.jpg`, aspectRatio: 0.670, year: "2019" },
  { id: "305940", src: `${BASE}/305940/xhbtr_6272b6e4-407c-469d-9a7d-cc1973703065_w1200.jpg`, srcLarge: `${BASE}/305940/xhbtr_6272b6e4-407c-469d-9a7d-cc1973703065_w1600.jpg`, aspectRatio: 0.670, year: "2019" },
];

export const years = [...new Set(notesImages.map((img) => img.year))];

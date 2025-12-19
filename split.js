const fs = require("fs");

const PAGE_SIZE = 20;
const INPUT_FILE = "sim_full.json";
const OUTPUT_DIR = "data";

if (!fs.existsSync(OUTPUT_DIR)){
  fs.mkdirSync(OUTPUT_DIR);
}

const raw = fs.readFileSync(INPUT_FILE, "utf8");
const sims = JSON.parse(raw);

const totalPages = Math.ceil(sims.length / PAGE_SIZE);

const ds= []
// const map_menh = {"M": "Mộc", "T":"Thổ", "H":"Hỏa", "TH":"Thuỷ", "K":"Kim"}
const map_menh = {"Mộc":"M", "Thổ":"T", "Hỏa":"H", "Thuỷ":"TH", "Kim":"K"}
sims.forEach(sim => {
    const ds_ob = {
        "ma": sim.mang,
        "g":sim.gia,
        "me":map_menh[sim.menh],
        "so":sim.so
    }
    const luan_ob = {
        "l": sim.luan
    }
    fs.writeFileSync(
    `${OUTPUT_DIR}/${sim.so}.json`,
    JSON.stringify(luan_ob)
  );
    ds.push(ds_ob)
});
fs.writeFileSync(
    `${OUTPUT_DIR}/ds.json`,
    JSON.stringify(ds)
  );
// ghi index.json
fs.writeFileSync(
  `${OUTPUT_DIR}/index.json`,
  JSON.stringify({
    pageSize: PAGE_SIZE,
    total: sims.length,
    totalPages
  }, null, 2)
);

// chia page
for (let i = 0; i < totalPages; i++){
  const pageData = ds.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE);
  fs.writeFileSync(
    `${OUTPUT_DIR}/page_${i + 1}.json`,
    JSON.stringify(pageData)
  );
}

console.log(`✅ Đã chia ${sims.length} sim thành ${totalPages} page`);
(function () {
  if (window.__autofillLoaded) return;
  window.__autofillLoaded = true;

  const ADDRESSES = {
    ID: {
      streets: ["Jl. Merdeka", "Jl. Sudirman", "Jl. Gatot Subroto", "Jl. Diponegoro", "Jl. Pahlawan", "Jl. Ahmad Yani", "Jl. Veteran"],
      cities: ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Semarang", "Medan", "Makassar"],
      states: ["DKI Jakarta", "Jawa Barat", "Jawa Timur", "DI Yogyakarta", "Jawa Tengah", "Sumatera Utara", "Sulawesi Selatan"],
      country: "Indonesia",
      countryCode: "ID",
      zip: () => String(10000 + Math.floor(Math.random() * 89999)),
      phone: () => "+628" + randomDigits(10)
    },
    US: {
      streets: ["Main St", "Oak Ave", "Pine Rd", "Maple Ln", "Cedar Blvd", "Elm St", "Washington Ave"],
      cities: ["Springfield", "Riverside", "Franklin", "Greenville", "Bristol", "Fairview", "Madison"],
      states: ["CA", "TX", "NY", "FL", "IL", "PA", "OH"],
      country: "United States",
      countryCode: "US",
      zip: () => String(10000 + Math.floor(Math.random() * 89999)),
      phone: () => "+1" + randomDigits(10)
    },
    GB: {
      streets: ["High St", "Church Rd", "Mill Ln", "Park Ave", "Queen St", "Station Rd"],
      cities: ["London", "Manchester", "Birmingham", "Leeds", "Bristol", "Liverpool"],
      states: ["England", "Scotland", "Wales", "Northern Ireland"],
      country: "United Kingdom",
      countryCode: "GB",
      zip: () => {
        const a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const r = (s) => s[Math.floor(Math.random() * s.length)];
        return `${r(a)}${r(a)}${1 + Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 9)}${r(a)}${r(a)}`;
      },
      phone: () => "+447" + randomDigits(9)
    },
    AU: {
      streets: ["George St", "King St", "Queen St", "Pitt St", "Collins St", "Bourke St"],
      cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra"],
      states: ["NSW", "VIC", "QLD", "WA", "SA", "ACT"],
      country: "Australia",
      countryCode: "AU",
      zip: () => String(1000 + Math.floor(Math.random() * 8999)),
      phone: () => "+614" + randomDigits(8)
    }
  };

  function randomDigits(n) {
    let s = "";
    for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
    return s;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateAddress(locale) {
    const data = ADDRESSES[locale] || ADDRESSES.US;
    const number = 1 + Math.floor(Math.random() * 999);
    return {
      line1: `${number} ${pick(data.streets)}`,
      line2: "",
      city: pick(data.cities),
      state: pick(data.states),
      zip: data.zip(),
      country: data.country,
      countryCode: data.countryCode,
      phone: data.phone()
    };
  }

  function emailToName(email) {
    const [localRaw = "", domainRaw = ""] = String(email).split("@");
    const local = localRaw.replace(/[^A-Za-z0-9]/g, "");
    const domainFirst = (domainRaw.split(".")[0] || "").replace(/[^A-Za-z0-9]/g, "");
    const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : "");
    const first = cap(local) || "User";
    const last = cap(domainFirst) || "Test";
    return {
      first,
      last,
      full: `${first} ${last}`,
      handle: (local + domainFirst).toLowerCase()
    };
  }

  function fieldMap(name, addr) {
    return [
      {
        selectors: [
          'input[autocomplete="given-name"]',
          'input[name*="firstname" i]',
          'input[name*="first-name" i]',
          'input[name="fname"]',
          'input[id*="firstname" i]',
          'input[id*="first-name" i]'
        ],
        value: name.first
      },
      {
        selectors: [
          'input[autocomplete="family-name"]',
          'input[name*="lastname" i]',
          'input[name*="last-name" i]',
          'input[name="lname"]',
          'input[id*="lastname" i]',
          'input[id*="last-name" i]'
        ],
        value: name.last
      },
      {
        selectors: [
          'input[autocomplete="name"]',
          'input[name="name"]',
          'input[name="fullname"]',
          'input[name="full_name"]',
          'input[id="name"]',
          'input[id*="full-name" i]'
        ],
        value: name.full
      },
      {
        selectors: [
          'input[autocomplete="username"]',
          'input[name="username"]',
          'input[name="user"]',
          'input[id="username"]'
        ],
        value: name.handle
      },
      {
        selectors: [
          'input[autocomplete="address-line1"]',
          'input[name*="address1" i]',
          'input[name*="street-address" i]',
          'input[name*="street_address" i]',
          'input[name*="street" i]',
          'input[name="address"]',
          'input[id*="address1" i]',
          'input[id*="street" i]'
        ],
        value: addr.line1
      },
      {
        selectors: [
          'input[autocomplete="address-line2"]',
          'input[name*="address2" i]',
          'input[id*="address2" i]'
        ],
        value: addr.line2
      },
      {
        selectors: [
          'input[autocomplete="address-level2"]',
          'input[name*="city" i]',
          'input[name*="town" i]',
          'input[id*="city" i]',
          'input[id*="town" i]'
        ],
        value: addr.city
      },
      {
        selectors: [
          'input[autocomplete="address-level1"]',
          'input[name*="state" i]',
          'input[name*="region" i]',
          'input[name*="province" i]',
          'input[id*="state" i]',
          'input[id*="region" i]',
          'input[id*="province" i]',
          'select[autocomplete="address-level1"]',
          'select[name*="state" i]',
          'select[name*="region" i]',
          'select[name*="province" i]'
        ],
        value: addr.state
      },
      {
        selectors: [
          'input[autocomplete="postal-code"]',
          'input[name*="zip" i]',
          'input[name*="postal" i]',
          'input[name*="postcode" i]',
          'input[id*="zip" i]',
          'input[id*="postal" i]',
          'input[id*="postcode" i]'
        ],
        value: addr.zip
      },
      {
        selectors: [
          'input[autocomplete="country"]',
          'select[autocomplete="country"]',
          'input[name*="country" i]',
          'select[name*="country" i]',
          'input[id*="country" i]',
          'select[id*="country" i]'
        ],
        value: addr.country,
        alt: addr.countryCode
      },
      {
        selectors: [
          'input[autocomplete="tel"]',
          'input[type="tel"]',
          'input[name*="phone" i]',
          'input[name*="mobile" i]',
          'input[id*="phone" i]',
          'input[id*="mobile" i]'
        ],
        value: addr.phone
      }
    ];
  }

  function isVisible(el) {
    if (!el || el.disabled || el.readOnly) return false;
    if (el.type === "hidden") return false;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;
    const style = window.getComputedStyle(el);
    return style.visibility !== "hidden" && style.display !== "none";
  }

  function setNativeValue(el, value) {
    const proto = Object.getPrototypeOf(el);
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
    if (setter) setter.call(el, value);
    else el.value = value;
  }

  function setValue(el, value) {
    if (!el || value == null || value === "") return false;
    if (!isVisible(el)) return false;

    if (el.tagName === "SELECT") {
      const target = String(value).toLowerCase();
      const opt = Array.from(el.options).find((o) => {
        return (
          o.value.toLowerCase() === target ||
          o.text.toLowerCase() === target
        );
      });
      if (!opt) return false;
      el.value = opt.value;
    } else {
      setNativeValue(el, value);
    }

    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new Event("blur", { bubbles: true }));
    return true;
  }

  function fillFields(name, addr) {
    let filled = 0;
    const used = new WeakSet();

    for (const { selectors, value, alt } of fieldMap(name, addr)) {
      for (const sel of selectors) {
        let matched = false;
        const els = document.querySelectorAll(sel);
        for (const el of els) {
          if (used.has(el)) continue;
          if (setValue(el, value) || (alt && setValue(el, alt))) {
            used.add(el);
            filled++;
            matched = true;
            break;
          }
        }
        if (matched) break;
      }
    }
    return filled;
  }

  window.__autofill = function (email, locale) {
    try {
      const name = emailToName(email);
      const addr = generateAddress(locale);
      const filled = fillFields(name, addr);
      return { filled };
    } catch (e) {
      return { filled: 0, error: String(e && e.message || e) };
    }
  };
})();

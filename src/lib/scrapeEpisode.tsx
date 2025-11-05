import { load, type CheerioAPI } from "cheerio"
import type { episode as episodeType } from "../types/types"
import axios from "axios"

const { BASEURL } = process.env

const scrapeEpisode = async (html: string): Promise<episodeType | undefined> => {
  const $ = load(html)
  const episode = getEpisodeTitle($)
  const download_urls = createDownloadData($)
  const previous_episode = getPrevEpisode($)
  const next_episode = getNextEpisode($)
  const anime = getAnimeData($)
  const qualityList = await getStreamQuality($)
  const stream_url = qualityList["480p"] || (await getStreamUrl($))

  if (!episode) return undefined

  return {
    episode,
    anime,
    has_next_episode: next_episode ? true : false,
    next_episode,
    has_previous_episode: previous_episode ? true : false,
    previous_episode,
    stream_url,
    streamList: qualityList,
    download_urls,
  }
}

const getEpisodeTitle = ($: CheerioAPI) => {
  return $(".venutama .posttl").text()
}

const getStreamUrl = async ($: CheerioAPI) => {
  const src = $("#pembed iframe").attr("src") || ""
  let url
  if (/ondesu\/hd|\/otakuplay\//.test(src)) {
    url = src.replace(/\/v\d+\//, "/v2/")
  } else {
    url = src.replace(/\/v\d+\//, "/v5/")
  }
  return await getBloggerSource(url)
}

const getBloggerSource = async (url: string): Promise<string> => {
  try {
    const blogger = await axios.get(url, {
      headers: {
        Host: "desustream.info",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Sec-GPC": "1",
        "Sec-CH-UA": '"Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"',
        "Sec-CH-UA-Mobile": "?0",
        "Sec-CH-UA-Platform": '"Windows"',
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Credentials": "true",
      },
    })
    const $$ = load(blogger.data)
    const urlparsed = new URL($$("#myIframe").attr("src") || "")
    return `/api/v1/stream/${urlparsed.searchParams.get("token")}`
  } catch (err) {
    return url
  }
}

const postToGetData = async (action: string, action2: string, videoData: any) => {
  const tasks = Object.entries(videoData).map(async ([key, value]: [string, any]) => {
    if (!value) return [key, null]
    try {
      const url = `https://otakudesu.best/wp-admin/admin-ajax.php`
      const form = new URLSearchParams()
      form.append("id", value.id)
      form.append("i", value.i)
      form.append("q", value.q)
      form.append("action", action)

      let res = await axios.post(url, form.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      const form2 = new URLSearchParams()
      form2.append("id", value.id)
      form2.append("i", value.i)
      form2.append("q", value.q)
      form2.append("action", action2)
      form2.append("nonce", res.data.data)

      res = await axios.post(url, form2.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      const $$ = load(Buffer.from(res.data.data, "base64").toString("utf8"))
      const pdrain_url = $$("iframe").attr("src")
      let finalUrl = pdrain_url

      if (pdrain_url && /ondesu\/hd|\/otaku|desudesu|\/desudesuhd3|play|watch|odesu/.test(pdrain_url)) {
        finalUrl = pdrain_url.replace(/\/v\d+\//, "/v2/")
      } else if (pdrain_url) {
        finalUrl = pdrain_url.replace(/\/v\d+\//, "/v5/")
      }
      if (finalUrl) {
        finalUrl = await getBloggerSource(finalUrl)
      }
      return [key.replace("m", ""), finalUrl]
    } catch (err) {
      console.error(`${key} error:`, err)
      return null
    }
  })

  const resultsArr = await Promise.all(tasks)
  return Object.fromEntries(resultsArr.filter(Boolean) as [string, string][])
}

const getStreamQuality = async ($: CheerioAPI) => {
  const streamLable = $(".mirrorstream")
  const results: any = {}
  ;["m360p", "m480p", "m720p"].forEach((q) => {
    const items = streamLable.find(`ul.${q} li a`)
    const last = items
      .filter((i, el) => {
        const text = $(el).text().toLowerCase()
        if (q == "m720p") return /otaku|desu/.test(text)
        return /odstream|desu|otaku/.test(text)
      })
      .first()
    if (last.length) {
      results[q] = JSON.parse(Buffer.from(last.attr("data-content") || "", "base64").toString("utf8"))
    }
  })
  const actions: string[] = []
  $("script").each((i, el) => {
    const scriptContent = $(el).html()
    if (!scriptContent) return
    const regex = /action\s*:\s*"([a-z0-9]+)"/gi
    let match
    while ((match = regex.exec(scriptContent)) !== null) {
      actions.push(match[1])
    }
  })
  const uniqueActions = [...new Set(actions)]
  const init = uniqueActions[1]
  const action = uniqueActions[0]
  const data = await postToGetData(init, action, results)
  return data
}

const createDownloadData = ($: CheerioAPI) => {
  const mp4 = getMp4DownloadUrls($)
  const mkv = getMkvDownloadUrls($)
  return {
    mp4,
    mkv,
  }
}

const getMp4DownloadUrls = ($: CheerioAPI) => {
  const result = []
  const mp4DownloadEls = $(".download ul:first li")
    .toString()
    .split("</li>")
    .filter((item) => item.trim() !== "")
    .map((item) => `${item}</li>`)

  for (const el of mp4DownloadEls) {
    const $ = load(el)
    const downloadUrls = $("a")
      .toString()
      .split("</a>")
      .filter((item) => item.trim() !== "")
      .map((item) => `${item}</a>`)
    const urls = []

    for (const downloadUrl of downloadUrls) {
      const $ = load(downloadUrl)
      urls.push({
        provider: $("a").text(),
        url: $("a").attr("href"),
      })
    }
    result.push({
      resolution: $("strong")
        .text()
        ?.replace(/([A-z][A-z][0-9] )/, ""),
      urls,
    })
  }

  return result
}

const getMkvDownloadUrls = ($: CheerioAPI) => {
  const result = []
  const mp4DownloadEls = $(".download ul:last li")
    .toString()
    .split("</li>")
    .filter((item) => item.trim() !== "")
    .map((item) => `${item}</li>`)

  for (const el of mp4DownloadEls) {
    const $ = load(el)
    const downloadUrls = $("a")
      .toString()
      .split("</a>")
      .filter((item) => item.trim() !== "")
      .map((item) => `${item}</a>`)
    const urls = []

    for (const url of downloadUrls) {
      const $ = load(url)
      urls.push({
        provider: $("a").text(),
        url: $("a").attr("href"),
      })
    }
    result.push({
      resolution: $("strong")
        .text()
        ?.replace(/([A-z][A-z][A-z] )/, ""),
      urls,
    })
  }

  return result
}

const getPrevEpisode = ($: CheerioAPI) => {
  if (!$(".flir a:first").attr("href")?.startsWith(`${BASEURL}/episode/`)) return null

  return {
    slug: $(".flir a:first")
      .attr("href")
      ?.replace(/^https:\/\/otakudesu\.[a-zA-Z0-9-]+\/episode\//, "")
      ?.replace("/", ""),
    otakudesu_url: $(".flir a:first").attr("href"),
  }
}

const getNextEpisode = ($: CheerioAPI) => {
  if (!$(".flir a:last").attr("href")?.startsWith(`${BASEURL}/episode/`)) return null

  return {
    slug: $(".flir a:last").attr("href")?.replace(`${BASEURL}/episode/`, "")?.replace("/", ""),
    otakudesu_url: $(".flir a:last").attr("href"),
  }
}

const getAnimeData = ($: CheerioAPI) => {
  if ($(".flir a:nth-child(3)").text().trim() === "" || $(".flir a:nth-child(3)").text() === undefined) {
    return {
      slug: $(".flir a:first").attr("href")?.replace(`${BASEURL}/anime/`, "")?.replace("/", ""),
      otakudesu_url: $(".flir a:first").attr("href"),
    }
  }

  return {
    slug: $(".flir a:nth-child(2)").attr("href")?.replace(`${BASEURL}/anime/`, "")?.replace("/", ""),
    otakudesu_url: $(".flir a:nth-child(2)").attr("href"),
  }
}

export default scrapeEpisode

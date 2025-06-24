<script lang="ts">
  import { onMount } from "svelte";
  import Fuse, { type FuseResult, type FuseResultMatch } from "fuse.js";
  import Icon from "@iconify/svelte";

  const SEARCH_RESULT_LIMIT = 10;

  // 搜索关键词
  let keyword = $state("");

  type SearchData = {
    type: "post" | "page" | "tag" | "category";
    title: string;
    content?: string;
    url: string;
    score?: number;
    highlight?: string[];
    titleHighlight?: string[];
  };

  let loading = $state(true);
  let inputEl: HTMLInputElement | undefined;
  let data = $state<SearchData[]>([]);
  let fuse: Fuse<SearchData> | undefined;

  // 组件挂载时加载 JSON 数据
  onMount(async () => {
    data = await fetch("/search-data.json").then((r) => r.json());
    loading = false;

    data = data.map((item, id) => ({
      ...item,
      id,
    }));

    fuse = new Fuse(data, {
      keys: ["title", "content", "url"],
      useExtendedSearch: true,
      ignoreLocation: true,
      includeMatches: true,
      includeScore: true,
      minMatchCharLength: 2,
    });

    inputEl?.focus();
  });

  let results = $derived.by(() => {
    const query = keyword.trim();

    // no keyword, return all data
    if (!query) {
      return data;
    }

    const results = new Map<string, SearchData>();

    for (const item of nonFuzzySearch(query)) {
      results.set(item.url, item);
    }

    for (const item of fuse
      ?.search(keyword, { limit: SEARCH_RESULT_LIMIT })
      .map((res) => createHighlight(res)) ?? []) {
      results.set(item.url, item);
    }

    return [...results.values()];
  });

  function nonFuzzySearch(query: string): SearchData[] {
    const ret = [];
    query = query.toLowerCase();
    for (const item of data) {
      if (ret.length >= SEARCH_RESULT_LIMIT) {
        break;
      }
      const titleHighlight = createHighlightByKeyword(item.title, query);
      const contentHighlight = item.content
        ? createHighlightByKeyword(item.content, query)
        : undefined;
      if (titleHighlight || contentHighlight) {
        ret.push({
          ...item,
          titleHighlight,
          highlight: contentHighlight,
        });
      }
    }

    return ret;
  }

  function createHighlightByKeyword(text: string, keyword: string) {
    const st = text.toLowerCase().indexOf(keyword);
    if (st === -1) {
      return undefined;
    }
    const ed = st + keyword.length;
    return [
      text.slice(Math.max(0, st - 30), st),
      text.slice(st, ed),
      text.slice(ed),
    ];
  }

  function createHighlightByMatches(matches: FuseResultMatch) {
    const text = matches.value;
    if (!text || matches.indices.length < 1) {
      return ["", "", ""];
    }
    const maxIndice = matches.indices.reduce((prev, curr) => {
      const [prevSt, prevEd] = prev;
      const [currSt, currEd] = curr;
      return prevEd - prevSt < currEd - currSt ? curr : prev;
    }, matches.indices[0]);
    const [st, ed] = maxIndice;

    const startNumber = window.innerWidth > 768 ? 30 : 20; // Adjust based on screen size

    return [
      text.slice(Math.max(0, st - startNumber), st),
      text.slice(st, ed + 1),
      text.slice(ed + 1),
    ];
  }

  function createHighlight(item: FuseResult<SearchData>): SearchData {
    if (!item.matches || item.matches.length < 0) return item.item;

    const ret: SearchData = {
      ...item.item,
      highlight: undefined,
      titleHighlight: undefined,
    };

    for (const match of item.matches) {
      if (match.key === "title") {
        ret.titleHighlight = createHighlightByMatches(match);
      } else if (match.key === "content") {
        ret.highlight = createHighlightByMatches(match);
      }
    }
    return ret;
  }
</script>

<div class="search-box w-full">
  <div class="input w-full">
    <Icon icon="mingcute:search-3-line"></Icon>
    <input
      id="inline-search-input"
      name="search-input"
      aria-label="搜索"
      class="search-input grow text-lg"
      type="text"
      placeholder="搜索博客文章、页面、标签、分类……"
      bind:value={keyword}
      bind:this={inputEl}
    />
  </div>

  <div class="search-results-container mt-4">
    {#if loading}
      <div class="flex justify-center items-center h-30 w-full">
        <div class="loading loading-dots loading-xl"></div>
      </div>
    {:else}
      <div class="results-list list">
        {#each results.slice(0, SEARCH_RESULT_LIMIT) as result}
          <div class="list-row hover:bg-primary/10 clickable">
            <a
              href={result.url}
              class="clickable-bkg-link"
              data-astro-prefetch
              aria-label={result.title}
            ></a>
            <div class="icon-container text-xl">
              {#if result.type === "post" || result.type === "page"}
                <Icon icon="mingcute:file-line" />
              {:else if result.type === "tag"}
                <Icon icon="mingcute:tag-line" />
              {:else if result.type === "category"}
                <Icon icon="mingcute:folder-2-line" />
              {/if}
            </div>
            <div class="result-body truncate">
              <span class="result-title font-bold">
                {#if result.titleHighlight}
                  {result.titleHighlight[0]}<mark
                    >{result.titleHighlight[1]}</mark
                  >{result.titleHighlight[2]}
                {:else}
                  {result.title}
                {/if}
              </span>
              {#if result.type === "post" || result.type === "page"}
                <div class="result-content">
                  <p class="content">
                    {#if result.highlight}
                      {result.highlight[0]}<mark>{result.highlight[1]}</mark
                      >{result.highlight[2]}
                    {:else}
                      {result.content}
                    {/if}
                  </p>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

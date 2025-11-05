import { load } from 'cheerio';

const pagination = (html: string, anoboy: boolean = false): false | {
  current_page: number;
  last_visible_page: number;
  has_next_page: boolean;
  next_page: number | null;
  has_previous_page: boolean;
  previous_page: number | null;
} => {
    console.log('isAnoboy', anoboy);
    const $ = load(html);
    const current_page = anoboy ? parseInt($('.current-page').text()) : parseInt($('.pagination .pagenavix .page-numbers.current').text());
    const last_visible_page = anoboy ?  parseInt($('.page__link').not(':has(i.fa-angle-right)').last().text()) : parseInt($('.pagination .pagenavix .page-numbers:last').prev('a.page-numbers').text());
    const next_page = current_page < last_visible_page ? current_page + 1 : null;
    const previous_page = current_page > 1 ? current_page - 1 : null;
    const has_next_page = current_page < last_visible_page;
    const has_previous_page = current_page > 1;
    if (!current_page)
        return false;
    return {
        current_page,
        last_visible_page: current_page < last_visible_page ? last_visible_page : current_page,
        has_next_page,
        next_page,
        has_previous_page,
        previous_page
    };
};
export default pagination;

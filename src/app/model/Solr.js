import RestClient from '../service/RestClient';

const generateSearchQueryByIndexes = ({ searchKey, indexes }) => `${indexes.join(`:${searchKey}*`)}:${searchKey}*`;

const generateFacetsQueryString = ({ facets }) => `facet=on&facet.sort=${facets.sort || 'count'}&facet.limit=${facets.limit || '-1'}&facet.mincount=${facets.mincount || 1}&facet.field=${facets.fields.join('&facet.field=')}`;

const generateFilterQueryByFilters = ({ filters }) => `fq=${filters.join('&fq=')}`;

const generateCollectionsQueryByFilters = ({ collections }) => `fq=collection_s:(${collections.join(' OR ')})`;

const generateQueryString = ({ facets, filters, collections }) => {
    const params = [];

    if(facets.fields && facets.fields.length > 0) {
        params.push(generateFacetsQueryString({ facets }));
    }

    if(filters.length > 0) {
        params.push(generateFilterQueryByFilters({ filters }));
    }

    if (collections.length > 0) {
        params.push(generateCollectionsQueryByFilters({ collections }));
    }

    return params.length > 0 ? `?${params.join('&')}` : '';
};

const generateSearchQuery = params => {
    const {
        searchKey, 
        indexes = [],
        dateRange = {},
        rows = 100, 
        page = 0 
    } = params;

    let query = {
        params: {
            q: indexes.length ? generateSearchQueryByIndexes({ searchKey, indexes }) : searchKey ? `${searchKey}*` : '*:*',
            start: page,
            rows,
            wt: 'json'
        }
    };

    if (dateRange.from || dateRange.to) {
        Object.assign(query.params, {
            fq: `year_i:[${dateRange.from || '*'} TO ${dateRange.to || '*'}]`
        });
    }

    return query;
};

const generateBrowseQuery = params => {
    const { index, prefix, sort } = params; 
    
    let query = {
        params: {
            'terms.fl': index,
            'terms.limit': -1,
        }
    };
    
    if (prefix) {
        Object.assign(query.params, {
            'terms.regex': `${prefix}.*`,
            'terms.regex.flag': 'case_insensitive'
        });
    }

    if (['count', 'index'].includes(sort)) {
        Object.assign(query.params, {
            'terms.sort': sort
        });
    }

    return query;
};

export const normalizeFacetsResults = list => {
    let normalized = [];

    list.forEach((value, index) => {
        if (index % 2 === 0) {
            normalized.push({ label: value });
        } else {
            Object.assign(normalized[(index-1)/2], {
                count: value
            });
        }
    });
    
    return normalized;
};

const debug = query => {
    if (DEBUG) {
        console.log(query.url, query.config && query.config.params);
    }

    return query;
};

export const search = ({ facets = {}, filters = [], collections = [], ...params}) => {
    
    const query = debug({
        url: `/solr/onstage/select${generateQueryString({ facets, filters, collections })}`, 
        config: generateSearchQuery(params) 
    });

    return RestClient.get(query).then(r => r);
};

export const browse = params => {

    const query = debug({ 
        url: '/solr/onstage/terms', 
        config: generateBrowseQuery(params)
    });

    return RestClient.get(query).then(r => r.terms && r.terms[params.index]);
};

export default {
    search,
    browse,
    normalizeFacetsResults
};
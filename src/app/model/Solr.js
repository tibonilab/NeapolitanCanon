import RestClient from '../service/RestClient';

const generateSearchQueryByIndexes = ({ searchKey, indexes }) => `${indexes.join(`:${searchKey}*`)}:${searchKey}*`;

const generateFacetsQueryString = ({ facets }) => `facet=on&facet.sort=count&facet.limit=-1&facet.mincount=1&facet.field=${facets.join('&facet.field=')}`;

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
            q: indexes.length ? generateSearchQueryByIndexes({ searchKey, indexes }) : `${searchKey}*`,
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

export const search = ({ facets = [], ...params}) => RestClient.get({ 
    url: `/solr/onstage/select?${generateFacetsQueryString({ facets })}`, 
    config: generateSearchQuery(params) 
}).then(r => r);

export const browse = params => RestClient.get({ 
    url: '/solr/onstage/terms', 
    config: generateBrowseQuery(params)
}).then(r => r.terms && r.terms[params.index]);

export default {
    search,
    browse,
    normalizeFacetsResults
};
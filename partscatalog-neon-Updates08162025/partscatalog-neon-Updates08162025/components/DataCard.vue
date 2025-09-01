<script setup>

import featureNames from '~/data/featureNames.js';

const props = defineProps({
    manufacturer: String,
    manufacturer_part_number: String,
    model: String,
    applications: Object,
    features: Object,
    country_of_origin: String
})

function flattenedApplications(applications){
    let flattenedApplications = [];
    for (let key in applications) {
        if (applications[key] === "TRUE") {
            flattenedApplications.push(key.replace("app_", ""));
        };
    }
    return flattenedApplications;
}

function formatFeatures(features){
    let formattedFeatures = {};
    let featureCount = 0;
    for (let feature in features) {
        formattedFeatures[featureNames[feature].short] = features[feature];
        featureCount++;
        if (featureCount === 3) {
            break;
        }
    }
   return formattedFeatures;
}

</script>

<template>
    <div class="card">
        <div class="card-title">
            <h3>{{ `${props.manufacturer}  ${props.model ? props.model : props.manufacturer_part_number}`  }}</h3>
            <span>{{ props.country_of_origin }}</span>
        </div>
        <div class="tag-list">
            <Tag v-for="application in flattenedApplications(props.applications)" :value="application"></Tag>
        </div>
        <ul>
            <li v-for="(value, key) in formatFeatures(props.features)"><span>{{ key }}: </span><span>{{ value }}</span></li>
        </ul>
    </div>
</template>

<style lang="scss">

ul {
    list-style: none;
    display: flex;
    flex-direction: row;
    gap: 12px;
    margin: 0;
    padding: 0;
    li {
        span:nth-child(1) {
            font-weight: 600;
        }
    }
}

.p-card-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: start;
}

.tag-list {
    display: flex;
    flex-direction: row;
    gap: 8px;
}

.card {
    border: 1px solid lightgray;
    border-radius: 8px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.card-title {
    display: flex;
    gap: 24px;
    align-items: first baseline;
    width: 100%;
}
  
</style>
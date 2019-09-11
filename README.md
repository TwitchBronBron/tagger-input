# tagger-input
An HTML custom element that supports adding multiple text tags. 

[Demo](https://twitchbronbron.github.io/tagger-input/)

## Usage

```html
<plumb-tagger value="['Predefined', 'Values']" onchange="console.log('It changed!', event)"></plumb-tagger>

<plumb-tagger id="tagger2"></plumb-tagger>
<script>
    document.getElementById('tagger2').addEventListener('change', (event)=>{
        console.log('It changed', event);
    });
</script>
```

## Attributes
| Name  | Description |
|-------|-------------|
| `value`| The value of the `plumb-tagger` input. This can be set from html, and will also be updated as the JSON.stringify text from the `plumb-tagger` element |
| `onchange` | See `change` in [events](#events) table below |

## Events
| Name | Description | 
| -----|-------------|
| `change` | Emitted whenever the value has changed by the user. Will not emit when changed programmatically by setting the property or the attribute |
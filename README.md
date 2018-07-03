# Parallex

[Discord](https://discord.gg/gqgnAcJ)

Parallex is a fairly new JavaScript framework. Currently it only has a small bit of functionality. Feel free to create issues/pull requests if you want to contribute.

# Usage

## Getting Started

Download the **parallex.js** file and import it with a script tag into your HTML, before other scripts that use Parallex:

    <script src="parallex.js"></script>
    
Next, initialise the Parallex object, using the following syntax:

    new Parallex ( <Object> options );
    
Inside the `options`, set your container element (defaults to `document.body`) and your data variables (explained further on).

Here's a simple example of the initialisation:

    new Parallex ({
      elm: '#container'
    })

## Reactive Template Engine

Parallex has a simple template engine that works similar to most other JavaScript templating engines. You simply add a data object to your Parallex initialisation function and then specify the data variables inside your HTML to print out the corresponding values in their place. For example:

    <div id="container">
      [[name]]
    </div>
    
    <script>
      var parallex = new Parallex({
        elm: '#container',
        data: {
          name: 'Steve'
        }
      })
    </script>
    
The content of the `div` will then be `Steve`. The data object is also reactive, which means that when you update a value in the object, the HTML content will also update, for example:

    parallex.data.name = 'John'
    
The content of the `div` will now be `John`.

## Events

To add events to your elements using Parallex, simply use the `Parallex.event` method and add a `p-on` attribute to the elements you want to add the event to. This attribute's syntax is `event:handler`. Here is an example:

The HTML:
    
    <button p-on='click:changeName'>Change Name To Mary</button>

The JavaScript:
    
    parallex.event('changeName', function(){
        parallex.data.name = 'Mary'
    })
    
    
## Lists

You can create quick lists using the `Parallex.list` method. Simply pass the list name and an options object to the method. The options object contains the element which is used as the list items and the list content. Lists are also reactive meaning you can easily update the lists by using array methods. For example:

The HTML:

    <ol>
      <li class='list-item'></li>
    </ol>
    
The JavaScript:

    parallex.list('birthdaylist', {
      elm: '.list-item',
      content: [
        'Steve: January, 19',
        'John: April, 21',
        'Mary: June, 30'
      ]
    })
    
    parallex.lists.birthdaylist.push('Emma: August, 14')

